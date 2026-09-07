import { useState, useEffect } from 'react';

type PayMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢', color: '#4285f4' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: '#5f259f' },
  { id: 'paytm', name: 'Paytm', icon: '🔵', color: '#00baf2' },
  { id: 'bhim', name: 'BHIM', icon: '🇮🇳', color: '#ff671f' },
  { id: 'other', name: 'Other UPI', icon: '📱', color: '#6b7280' },
];

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank',
];

const WALLETS = [
  { id: 'paytm', name: 'Paytm Wallet', icon: '🔵', balance: '₹1,240', color: '#00baf2' },
  { id: 'amazon', name: 'Amazon Pay', icon: '🟠', balance: '₹580', color: '#ff9900' },
  { id: 'mobikwik', name: 'MobiKwik', icon: '🔴', balance: '₹0', color: '#e5173f' },
  { id: 'freecharge', name: 'FreeCharge', icon: '🟢', balance: '₹320', color: '#59c23a' },
];

interface Props {
  amount: number;
  bookingId: string;
  serviceType: string;
  vehicleName: string;
  onSuccess: (method: string) => void;
  onClose: () => void;
}

type Stage = 'method' | 'details' | 'processing' | 'success' | 'failed';

export default function PaymentModal({ amount, bookingId, serviceType, vehicleName, onSuccess, onClose }: Props) {
  const [method, setMethod] = useState<PayMethod>('upi');
  const [stage, setStage] = useState<Stage>('method');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [wallet, setWallet] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [progress, setProgress] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (stage === 'processing') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + (p < 40 ? 3 : p < 80 ? 2 : 0.8);
        });
      }, 60);
      const timer = setTimeout(() => {
        setStage(Math.random() > 0.1 ? 'success' : 'failed');
      }, 3200);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
  }, [stage]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  const canProceed = method === 'upi'
    ? (upiApp !== '' || upiId.includes('@'))
    : method === 'card'
    ? cardNum.replace(/\s/g, '').length === 16 && cardName && cardExpiry.length === 5 && cardCvv.length === 3
    : method === 'netbanking'
    ? bank !== ''
    : wallet !== '';

  const methodLabel: Record<PayMethod, string> = { upi: 'UPI', card: 'Debit/Credit Card', netbanking: 'Net Banking', wallet: 'Wallet' };

  function handlePay() {
    if (method === 'card') { setOtpSent(true); setCountdown(30); return; }
    setStage('processing');
  }
  function handleOtpVerify() { setStage('processing'); }

  if (stage === 'processing') return (
    <Overlay onClose={() => {}}>
      <ModalBox>
        <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔐</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '6px' }}>Processing Payment</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '28px' }}>Please do not close this window</p>
          <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), #f59e0b)', borderRadius: '3px', transition: 'width 0.1s linear' }} />
          </div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>₹{amount.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>TXN#{bookingId.toUpperCase()}{Date.now().toString().slice(-6)}</div>
          {method === 'upi' && (
            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--muted)', borderRadius: '10px', display: 'flex', align: 'center', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Check your UPI app for payment request</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>Waiting for approval…</span>
              </div>
            </div>
          )}
        </div>
      </ModalBox>
    </Overlay>
  );

  if (stage === 'success') return (
    <Overlay onClose={onClose}>
      <ModalBox>
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b98122', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>✓</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>Payment Successful!</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--foreground)', marginBottom: '4px' }}>₹{amount.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '20px' }}>via {methodLabel[method]}</div>
          <div style={{ background: 'var(--muted)', borderRadius: '10px', padding: '14px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['Service', serviceType],
              ['Vehicle', vehicleName],
              ['Transaction ID', `TXN${bookingId.toUpperCase()}${Date.now().toString().slice(-6)}`],
              ['Date', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
              ['Payment Method', methodLabel[method]],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{l}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', fontFamily: l === 'Transaction ID' ? 'var(--font-mono)' : 'inherit', fontSize: l === 'Transaction ID' ? '10px' : '12px' } as any}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                const receiptWin = window.open('', '_blank', 'width=420,height=600');
                if (receiptWin) {
                  receiptWin.document.write(generateReceiptHTML({ amount, serviceType, vehicleName, method: methodLabel[method], bookingId }));
                  receiptWin.document.close();
                  receiptWin.print();
                }
              }}
              style={{ flex: 1, padding: '11px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ⬇ Download Invoice
            </button>
            <button onClick={() => { onSuccess(methodLabel[method]); onClose(); }} style={{ flex: 1, padding: '11px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Done</button>
          </div>
        </div>
      </ModalBox>
    </Overlay>
  );

  if (stage === 'failed') return (
    <Overlay onClose={onClose}>
      <ModalBox>
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ef444422', border: '3px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>✕</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#ef4444', marginBottom: '6px' }}>Payment Failed</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '20px' }}>The transaction was declined. Please try again or use a different payment method.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
            <button onClick={() => setStage('method')} style={{ flex: 1, padding: '11px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Try Again</button>
          </div>
        </div>
      </ModalBox>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <ModalBox>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '2px' }}>Complete Payment</h2>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{serviceType} · {vehicleName}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Amount chip */}
        <div style={{ background: 'linear-gradient(135deg, #ff6b2b22 0%, #8b5cf622 100%)', border: '1px solid #ff6b2b44', borderRadius: '10px', padding: '14px 18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Amount Due</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>₹{amount.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>Booking</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--foreground)', fontWeight: 600 }}>#{bookingId.toUpperCase()}</div>
          </div>
        </div>

        {/* Method tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '18px' }}>
          {([
            { id: 'upi', label: 'UPI', icon: '📲' },
            { id: 'card', label: 'Card', icon: '💳' },
            { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
            { id: 'wallet', label: 'Wallet', icon: '👛' },
          ] as { id: PayMethod; label: string; icon: string }[]).map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              style={{ padding: '10px 6px', border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', background: method === m.id ? '#ff6b2b12' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '18px' }}>{m.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: method === m.id ? 700 : 500, color: method === m.id ? 'var(--primary)' : 'var(--foreground)' }}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* UPI panel */}
        {method === 'upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Pay via App</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {UPI_APPS.map(app => (
                  <button key={app.id} onClick={() => { setUpiApp(app.id); setUpiId(''); }}
                    style={{ padding: '10px 4px', border: `2px solid ${upiApp === app.id ? app.color : 'var(--border)'}`, borderRadius: '8px', background: upiApp === app.id ? app.color + '15' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '20px' }}>{app.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: upiApp === app.id ? app.color : 'var(--muted-foreground)', lineHeight: 1.2, textAlign: 'center', fontFamily: 'var(--font-sans)' }}>{app.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 500 }}>OR enter UPI ID</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>UPI ID</label>
              <input value={upiId} onChange={e => { setUpiId(e.target.value); setUpiApp(''); }} placeholder="yourname@upi"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: `1px solid ${upiId.includes('@') ? '#10b981' : 'var(--border)'}`, borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-mono)', outline: 'none' }} />
              {upiId.includes('@') && <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>✓ Valid UPI format</div>}
            </div>
          </div>
        )}

        {/* Card panel */}
        {method === 'card' && !otpSent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Card preview */}
            <div style={{ height: '130px', borderRadius: '12px', background: `linear-gradient(135deg, #1a1f30 0%, #2d3452 50%, #ff6b2b44 100%)`, border: '1px solid var(--border)', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,107,43,0.1)' }} />
              <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(59,130,246,0.07)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>CREDIT / DEBIT</div>
                <div style={{ display: 'flex', gap: '-4px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eb001b', opacity: 0.9 }} />
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f79e1b', opacity: 0.9, marginLeft: '-6px' }} />
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.15em', marginBottom: '6px' }}>
                  {cardNum || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>{cardName || 'CARD HOLDER NAME'}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Card Number</label>
              <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }} />
            </div>
            <div>
              <label style={labelStyle}>Cardholder Name</label>
              <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="AS PRINTED ON CARD"
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Expiry</label>
                <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }} />
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="•••" maxLength={3} type="password" style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div onClick={() => setSaveCard(!saveCard)} style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${saveCard ? 'var(--primary)' : 'var(--border)'}`, background: saveCard ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {saveCard && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Save card securely for future payments</span>
            </label>
          </div>
        )}

        {/* Card OTP verification */}
        {method === 'card' && otpSent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px' }}>📱</div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Enter OTP</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>A 6-digit OTP has been sent to your registered mobile</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <input key={i} maxLength={1} value={otp[i] ?? ''}
                  onChange={e => {
                    const digits = otp.split('');
                    digits[i] = e.target.value.replace(/\D/g, '');
                    setOtp(digits.join('').slice(0, 6));
                    if (e.target.value && i < 5) (document.querySelectorAll('.otp-input')[i + 1] as HTMLInputElement)?.focus();
                  }}
                  className="otp-input"
                  style={{ width: '44px', height: '52px', textAlign: 'center', fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 700, background: 'var(--muted)', border: `2px solid ${otp[i] ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', color: 'var(--foreground)', outline: 'none' }} />
              ))}
            </div>
            {countdown > 0
              ? <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Resend OTP in <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{countdown}s</span></div>
              : <button onClick={() => setCountdown(30)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Resend OTP</button>
            }
            <button onClick={handleOtpVerify} disabled={otp.length < 6} style={{ padding: '12px', background: otp.length === 6 ? 'var(--primary)' : 'var(--muted)', color: otp.length === 6 ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: otp.length === 6 ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-display)' }}>
              Verify & Pay ₹{amount.toLocaleString()}
            </button>
            <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>🔒 Secured by 3D Secure authentication</p>
            <button onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← Change payment details</button>
          </div>
        )}

        {/* Net Banking panel */}
        {method === 'netbanking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Select Your Bank</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                {BANKS.map(b => (
                  <button key={b} onClick={() => setBank(b)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', border: `2px solid ${bank === b ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', background: bank === b ? '#ff6b2b10' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: bank === b ? 'var(--primary)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🏦</div>
                    <span style={{ fontSize: '13px', fontWeight: bank === b ? 600 : 400, color: bank === b ? 'var(--foreground)' : 'var(--secondary-foreground)', flex: 1 }}>{b}</span>
                    {bank === b && <span style={{ color: 'var(--primary)', fontSize: '14px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            {bank && (
              <div style={{ padding: '10px 14px', background: '#10b98115', border: '1px solid #10b98133', borderRadius: '8px', fontSize: '12px', color: '#10b981' }}>
                ℹ️ You will be redirected to {bank}'s secure net banking portal
              </div>
            )}
          </div>
        )}

        {/* Wallet panel */}
        {method === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {WALLETS.map(w => {
              const bal = parseInt(w.balance.replace(/[^\d]/g, ''));
              const canPay = bal >= amount;
              return (
                <button key={w.id} onClick={() => canPay && setWallet(w.id)} disabled={!canPay}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: `2px solid ${wallet === w.id ? w.color : 'var(--border)'}`, borderRadius: '10px', background: wallet === w.id ? w.color + '12' : !canPay ? 'var(--muted)' : 'transparent', cursor: canPay ? 'pointer' : 'not-allowed', opacity: !canPay ? 0.5 : 1, fontFamily: 'var(--font-sans)', transition: 'all 0.15s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: w.color + '22', border: `1px solid ${w.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{w.icon}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{w.name}</div>
                    <div style={{ fontSize: '12px', color: canPay ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{w.balance} available</div>
                  </div>
                  {!canPay && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>Insufficient</span>}
                  {wallet === w.id && <span style={{ color: w.color, fontSize: '16px' }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Pay button (not shown when OTP is active) */}
        {!(method === 'card' && otpSent) && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handlePay} disabled={!canProceed}
              style={{ width: '100%', padding: '14px', background: canProceed ? 'var(--primary)' : 'var(--muted)', color: canProceed ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: canProceed ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', transition: 'all 0.15s' }}>
              {method === 'card' ? 'Continue to OTP →' : `Pay ₹${amount.toLocaleString()}`}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>🔒 256-bit SSL secured · PCI DSS compliant</span>
            </div>
          </div>
        )}
      </ModalBox>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', width: '440px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', background: 'var(--muted)', border: '1px solid var(--border)',
  borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none'
};

function generateReceiptHTML({ amount, serviceType, vehicleName, method, bookingId }: {
  amount: number; serviceType: string; vehicleName: string; method: string; bookingId: string;
}) {
  const txnId = `TXN${bookingId.toUpperCase()}${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const gst = Math.round(amount * 0.18);
  const subtotal = amount - gst;
  return `<!DOCTYPE html><html><head><title>VehicleCare Pro Invoice</title>
<style>body{font-family:system-ui,sans-serif;max-width:400px;margin:0 auto;padding:24px;color:#111}
.header{text-align:center;border-bottom:2px solid #ff6b2b;padding-bottom:16px;margin-bottom:16px}
.brand{font-size:22px;font-weight:800;color:#ff6b2b}h2{margin:0 0 4px;font-size:14px}
.row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #eee}
.total{font-size:16px;font-weight:700;color:#ff6b2b;border-top:2px solid #ff6b2b;padding-top:10px;margin-top:4px}
.badge{background:#10b98122;color:#10b981;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-top:8px}
.footer{margin-top:20px;text-align:center;font-size:11px;color:#888}
</style></head><body>
<div class="header"><div class="brand">VehicleCare Pro</div><h2>Tax Invoice / Receipt</h2><div style="font-size:11px;color:#888">GST: 29ABCDE1234F1Z5</div></div>
<div class="row"><span>Invoice No.</span><span style="font-family:monospace">${txnId}</span></div>
<div class="row"><span>Date</span><span>${date}</span></div>
<div class="row"><span>Service</span><span>${serviceType}</span></div>
<div class="row"><span>Vehicle</span><span>${vehicleName}</span></div>
<div class="row"><span>Payment Method</span><span>${method}</span></div>
<div style="margin-top:12px">
<div class="row"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
<div class="row"><span>GST (18%)</span><span>₹${gst.toLocaleString()}</span></div>
<div class="row total"><span>Total Paid</span><span>₹${amount.toLocaleString()}</span></div>
</div>
<div style="text-align:center;margin-top:12px"><div class="badge">✓ PAYMENT SUCCESSFUL</div></div>
<div class="footer">Thank you for choosing VehicleCare Pro<br>support@vehiclecarepro.in · 1800-VEHICLE</div>
</body></html>`;
}
