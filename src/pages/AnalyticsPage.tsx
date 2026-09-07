import type { User } from '../types';
import { revenueData, serviceTypeData } from '../mockData';
import StatCard from '../components/StatCard';

function FullBarChart({ data }: { data: { month: string; revenue: number; bookings: number }[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '160px', padding: '0 4px', marginBottom: '10px' }}>
        {data.map(d => (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>₹{(d.revenue / 1000).toFixed(0)}k</div>
            <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', height: `${(d.revenue / maxRev) * 130}px`, minHeight: '4px', opacity: d.month === 'Nov' ? 0.6 : 1, transition: 'height 0.8s ease', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{d.month}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '20px' }} />
    </div>
  );
}

export default function AnalyticsPage({ user }: { user: User }) {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = revenueData.reduce((s, d) => s + d.bookings, 0);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Revenue & Analytics</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Financial performance and booking insights · {user.role === 'admin' ? 'Platform-wide' : 'Your centers'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} trend={{ value: '18% vs last year', up: true }} icon="💰" accent="#10b981" />
        <StatCard label="Total Bookings" value={totalBookings} trend={{ value: '12% this month', up: true }} icon="📅" accent="#ff6b2b" />
        <StatCard label="Avg per Booking" value={`₹${Math.round(totalRevenue / totalBookings).toLocaleString()}`} sub="Revenue average" icon="📊" accent="#3b82f6" />
        <StatCard label="Completion Rate" value="92%" trend={{ value: '3% vs last month', up: true }} icon="✅" accent="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Monthly Revenue (2024)</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['6M', '12M', 'YTD'].map(p => (
                <button key={p} style={{ padding: '4px 10px', background: p === '6M' ? 'var(--primary)' : 'var(--muted)', color: p === '6M' ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{p}</button>
              ))}
            </div>
          </div>
          <FullBarChart data={revenueData} />
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '20px' }}>Service Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {serviceTypeData.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>{s.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${s.value}%`, background: s.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Monthly Breakdown</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Month', 'Revenue', 'Bookings', 'Avg Booking Value', 'Growth'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {revenueData.map((d, i) => {
              const prev = revenueData[i - 1];
              const growth = prev ? ((d.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null;
              return (
                <tr key={d.month} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)08' }}>
                  <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{d.month} 2024</td>
                  <td style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>₹{d.revenue.toLocaleString()}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--foreground)' }}>{d.bookings}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>₹{Math.round(d.revenue / d.bookings).toLocaleString()}</td>
                  <td style={{ padding: '12px 20px' }}>
                    {growth && <span style={{ fontSize: '12px', fontWeight: 600, color: Number(growth) >= 0 ? '#10b981' : '#ef4444' }}>{Number(growth) >= 0 ? '↑' : '↓'} {Math.abs(Number(growth))}%</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
