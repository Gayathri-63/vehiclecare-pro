import { useState } from 'react';
import type { User } from '../types';
import { mockPayments, mockBookings } from '../mockData';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import PaymentModal from '../components/PaymentModal';

interface PendingPay {
  amount: number;
  bookingId: string;
  serviceType: string;
  vehicleName: string;
}

export default function PaymentsPage({ user }: { user: User }) {
  const isOwner = user.role === 'owner' || user.role === 'admin';
  const payments = isOwner ? mockPayments : mockPayments.filter(p => p.customerId === user.id);
  const [modalData, setModalData] = useState<PendingPay | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');

  const displayPayments = payments.map(p => ({
    ...p,
    status: paidIds.has(p.id) ? ('paid' as const) : p.status,
  }));

  const filteredPayments = activeFilter === 'all'
    ? displayPayments
    : displayPayments.filter(p => p.status === activeFilter);

  const totalPaid = displayPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = displayPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = displayPayments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  function openPayModal(paymentId: string) {
    const p = payments.find(x => x.id === paymentId);
    if (!p) return;
    const b = mockBookings.find(x => x.id === p.bookingId);
    setModalData({
      amount: p.amount,
      bookingId: p.bookingId,
      serviceType: b?.serviceType ?? 'Vehicle Service',
      vehicleName: b?.vehicleName ?? 'Your Vehicle',
    });
  }

  function handlePaySuccess(payId: string) {
    setPaidIds(prev => new Set([...prev, payId]));
  }

  const methodIcon: Record<string, string> = {
    UPI: '📲', Card: '💳', 'Net Banking': '🏦', Wallet: '👛',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>
          {isOwner ? 'Revenue & Payments' : 'My Payments'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Transaction history · Secure payments via UPI, Card, Net Banking & Wallets</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Paid" value={`₹${totalPaid.toLocaleString()}`} icon="✅" accent="#10b981" sub={`${displayPayments.filter(p => p.status === 'paid').length} transactions`} />
        <StatCard label="Pending" value={`₹${totalPending.toLocaleString()}`} icon="⏳" accent="#f59e0b" sub={`${displayPayments.filter(p => p.status === 'pending').length} awaiting payment`} />
        <StatCard label="Refunded" value={`₹${totalRefunded.toLocaleString()}`} icon="↩️" accent="#6b7280" sub={`${displayPayments.filter(p => p.status === 'refunded').length} refunds`} />
        <StatCard label="Transactions" value={payments.length} icon="🧾" accent="#3b82f6" sub="All time" />
      </div>

      {/* Pending payment alert */}
      {totalPending > 0 && !isOwner && (
        <div style={{ background: 'linear-gradient(90deg, #f59e0b15 0%, #ff6b2b10 100%)', border: '1px solid #f59e0b44', borderRadius: '10px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>You have pending payments</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>₹{totalPending.toLocaleString()} due — complete payment to avoid service delays</div>
            </div>
          </div>
          <button
            onClick={() => {
              const pending = displayPayments.find(p => p.status === 'pending');
              if (pending) openPayModal(pending.id);
            }}
            style={{ padding: '9px 18px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0 }}>
            Pay Now
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--muted)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        {(['all', 'paid', 'pending', 'refunded'] as const).map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: activeFilter === f ? 'var(--card)' : 'transparent', color: activeFilter === f ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: '13px', fontWeight: activeFilter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize', boxShadow: activeFilter === f ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
            {f} {f !== 'all' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', opacity: 0.7 }}>({displayPayments.filter(p => p.status === f).length})</span>}
          </button>
        ))}
      </div>

      {/* Transactions list */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>
            Transaction History <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--muted-foreground)', marginLeft: '6px' }}>({filteredPayments.length})</span>
          </h3>
          <button style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Export CSV ↓</button>
        </div>

        {filteredPayments.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '14px' }}>
            No {activeFilter !== 'all' ? activeFilter : ''} transactions found.
          </div>
        ) : (
          filteredPayments.map((p, i) => {
            const booking = mockBookings.find(b => b.id === p.bookingId);
            const txnId = `TXN${p.id.toUpperCase()}${p.bookingId.slice(-4).toUpperCase()}`;
            return (
              <div key={p.id} style={{ padding: '16px 20px', borderBottom: i < filteredPayments.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Method icon */}
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: p.status === 'paid' ? '#10b98120' : p.status === 'pending' ? '#f59e0b20' : 'var(--muted)', border: `1px solid ${p.status === 'paid' ? '#10b98133' : p.status === 'pending' ? '#f59e0b33' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {methodIcon[p.method] ?? '💰'}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{booking?.serviceType ?? 'Vehicle Service'}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: p.status === 'refunded' ? '#6b7280' : 'var(--foreground)', textDecoration: p.status === 'refunded' ? 'line-through' : 'none' }}>
                      ₹{p.amount.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{booking?.vehicleName ?? 'Vehicle'}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{txnId}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{p.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge variant={p.status} />
                      {p.status === 'paid' && (
                        <button
                          onClick={() => {
                            const receiptWin = window.open('', '_blank', 'width=420,height=600');
                            if (receiptWin) {
                              receiptWin.document.write(generateReceiptHTML({
                                amount: p.amount,
                                serviceType: booking?.serviceType ?? 'Service',
                                vehicleName: booking?.vehicleName ?? 'Vehicle',
                                method: p.method,
                                bookingId: p.bookingId,
                                txnId,
                                date: p.date,
                              }));
                              receiptWin.document.close();
                              receiptWin.print();
                            }
                          }}
                          style={{ padding: '5px 12px', background: '#3b82f615', color: '#3b82f6', border: '1px solid #3b82f633', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          ⬇ Invoice
                        </button>
                      )}
                      {p.status === 'pending' && !isOwner && (
                        <button
                          onClick={() => openPayModal(p.id)}
                          style={{ padding: '5px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          Pay Now
                        </button>
                      )}
                      {p.status === 'paid' && !isOwner && (
                        <button style={{ padding: '5px 12px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Accepted payment methods info strip */}
      <div style={{ marginTop: '16px', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Accepted payment methods:</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[['📲', 'UPI'], ['💳', 'Visa/MC'], ['🏦', 'Net Banking'], ['👛', 'Wallets']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--secondary-foreground)' }}>
              <span style={{ fontSize: '14px' }}>{icon}</span> {label}
            </div>
          ))}
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px', fontSize: '12px', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🔒 <span>256-bit SSL Secured</span>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {modalData && (
        <PaymentModal
          amount={modalData.amount}
          bookingId={modalData.bookingId}
          serviceType={modalData.serviceType}
          vehicleName={modalData.vehicleName}
          onSuccess={(method) => {
            const p = payments.find(x => x.bookingId === modalData.bookingId);
            if (p) handlePaySuccess(p.id);
          }}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}

function generateReceiptHTML({ amount, serviceType, vehicleName, method, bookingId, txnId, date }: {
  amount: number; serviceType: string; vehicleName: string; method: string; bookingId: string; txnId: string; date: string;
}) {
  const gst = Math.round(amount * 0.18);
  const subtotal = amount - gst;
  return `<!DOCTYPE html><html><head><title>VehicleCare Pro Invoice</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:32px 24px;color:#111;background:#fff}
  .brand{font-size:26px;font-weight:900;color:#ff6b2b;letter-spacing:-0.02em}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #ff6b2b;margin-bottom:20px}
  .header-right{text-align:right;font-size:12px;color:#666}
  h2{font-size:13px;font-weight:600;color:#666;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px}
  .row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;border-bottom:1px solid #f0f0f0}
  .row span:last-child{font-weight:600;text-align:right}
  .total-row{display:flex;justify-content:space-between;padding:10px 0 0;font-size:16px;font-weight:800;color:#ff6b2b;border-top:2px solid #ff6b2b;margin-top:6px}
  .badge{background:#10b98120;color:#10b981;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;display:inline-block;margin:16px 0}
  .footer{margin-top:24px;text-align:center;font-size:11px;color:#aaa;line-height:1.8;border-top:1px solid #eee;padding-top:16px}
  .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin:16px 0 8px}
  @media print{body{padding:16px}}
</style></head><body>
<div class="header">
  <div><div class="brand">VehicleCare Pro</div><div style="font-size:11px;color:#aaa;margin-top:2px">GST: 29ABCDE1234F1Z5</div></div>
  <div class="header-right"><h2>Tax Invoice</h2><div style="font-size:13px;font-weight:600">${txnId}</div><div style="color:#aaa;margin-top:2px">${date}</div></div>
</div>
<div class="section-title">Service Details</div>
<div class="row"><span>Service Type</span><span>${serviceType}</span></div>
<div class="row"><span>Vehicle</span><span>${vehicleName}</span></div>
<div class="row"><span>Payment Method</span><span>${method}</span></div>
<div class="section-title">Billing Breakdown</div>
<div class="row"><span>Service Amount</span><span>₹${subtotal.toLocaleString()}</span></div>
<div class="row"><span>GST @ 18%</span><span>₹${gst.toLocaleString()}</span></div>
<div class="total-row"><span>Total Paid</span><span>₹${amount.toLocaleString()}</span></div>
<div style="text-align:center"><div class="badge">✓ Payment Confirmed</div></div>
<div class="footer">
  VehicleCare Pro · 42, MG Road, Bangalore · 560001<br>
  support@vehiclecarepro.in · 1800-VEHICLE (1800-843-4253)<br>
  This is a computer-generated invoice and does not require a signature.
</div>
</body></html>`;
}
