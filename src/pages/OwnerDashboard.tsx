import { useState } from 'react';
import type { User, Page } from '../types';
import { mockBookings, mockServiceCenters, revenueData, serviceTypeData } from '../mockData';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

function MiniBarChart({ data }: { data: { month: string; revenue: number; bookings: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', padding: '0 4px' }}>
      {data.map(d => (
        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '3px 3px 0 0', height: `${(d.revenue / max) * 64}px`, opacity: d.month === 'Nov' ? 1 : 0.5, transition: 'height 0.6s ease', minHeight: '4px' }} />
          <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 40;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {data.map(d => {
          const dash = (d.value / total) * circ;
          const gap = circ - dash;
          const rotation = (offset / total) * 360 - 90;
          offset += d.value;
          return (
            <circle key={d.name} cx="50" cy="50" r={r} fill="none" stroke={d.color} strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }} />
          );
        })}
        <text x="50" y="54" textAnchor="middle" fill="var(--foreground)" fontSize="13" fontWeight="700" fontFamily="var(--font-display)">{total}%</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{d.name}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OwnerDashboard({ user, onPageChange }: { user: User; onPageChange: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState<'pending' | 'today' | 'all'>('pending');
  const myCenters = mockServiceCenters.filter(sc => sc.ownerId === user.id);
  const allBookings = mockBookings;
  const filtered = activeTab === 'pending' ? allBookings.filter(b => b.status === 'pending')
    : activeTab === 'today' ? allBookings.filter(b => b.scheduledDate === '2024-11-08')
    : allBookings;

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = allBookings.length;
  const completedCount = allBookings.filter(b => b.status === 'completed').length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Service Center Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{myCenters.length} service centers · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} trend={{ value: '18% vs last month', up: true }} icon="💰" accent="#10b981" />
        <StatCard label="Total Bookings" value={totalBookings} sub="All centers" icon="📅" accent="#ff6b2b" trend={{ value: '12% this month', up: true }} />
        <StatCard label="Completed" value={completedCount} sub={`${Math.round(completedCount / totalBookings * 100)}% completion`} icon="✅" accent="#3b82f6" />
        <StatCard label="Pending Requests" value={allBookings.filter(b => b.status === 'pending').length} sub="Awaiting acceptance" icon="⏳" accent="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Revenue chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Monthly Revenue</h3>
            <button onClick={() => onPageChange('analytics')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Full Report →</button>
          </div>
          <MiniBarChart data={revenueData} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
            {[['This Month', '₹89,000'], ['Last Month', '₹2,48,000'], ['YTD', `₹${(totalRevenue / 100000).toFixed(1)}L`]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px', color: 'var(--foreground)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Service breakdown */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Service Types</h3>
          <DonutChart data={serviceTypeData} />
        </div>
      </div>

      {/* Bookings table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Bookings</h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['pending', 'today', 'all'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === tab ? 'var(--primary)' : 'var(--muted)', color: activeTab === tab ? '#fff' : 'var(--muted-foreground)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Vehicle', 'Service', 'Date/Time', 'Mechanic', 'Cost', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)10' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{b.customerName}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{b.vehicleName}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--foreground)' }}>{b.serviceType}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{b.scheduledDate}<br />{b.scheduledTime}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{b.mechanicName ?? <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>Unassigned</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>₹{(b.actualCost ?? b.estimatedCost).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={b.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {b.status === 'pending' && (
                        <>
                          <button style={{ padding: '4px 10px', background: '#10b98122', color: '#10b981', border: '1px solid #10b98133', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Accept</button>
                          <button style={{ padding: '4px 10px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Reject</button>
                        </>
                      )}
                      {(b.status === 'confirmed' || b.status === 'in-progress') && (
                        <button style={{ padding: '4px 10px', background: '#8b5cf622', color: '#8b5cf6', border: '1px solid #8b5cf633', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Update</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
