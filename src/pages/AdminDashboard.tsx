import { useState } from 'react';
import type { User, Page } from '../types';
import { mockUsers, mockServiceCenters, mockBookings, revenueData, serviceTypeData, adminStats } from '../mockData';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

function BarChart({ data }: { data: { month: string; revenue: number; bookings: number }[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  const maxBook = Math.max(...data.map(d => d.bookings));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', marginBottom: '8px' }}>
        {data.map(d => (
          <div key={d.month} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px', height: '100%' }}>
            <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '3px 3px 0 0', height: `${(d.revenue / maxRev) * 100}%`, opacity: 0.85, minHeight: '4px', transition: 'height 0.8s ease' }} title={`₹${d.revenue.toLocaleString()}`} />
            <div style={{ flex: 1, background: '#3b82f6', borderRadius: '3px 3px 0 0', height: `${(d.bookings / maxBook) * 100}%`, opacity: 0.7, minHeight: '2px', transition: 'height 0.8s ease' }} title={`${d.bookings} bookings`} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {data.map(d => (
          <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{d.month}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
        {[['Revenue', 'var(--primary)'], ['Bookings', '#3b82f6']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ user, onPageChange }: { user: User; onPageChange: (p: Page) => void }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'centers' | 'complaints'>('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'centers', label: 'Service Centers' },
    { id: 'complaints', label: 'Complaints' },
  ] as const;

  const mockComplaints = [
    { id: 'c1', user: 'Arjun Sharma', center: 'AutoCare Pro', issue: 'Charged more than quoted price', date: '2024-11-07', priority: 'high' as const },
    { id: 'c2', user: 'Priya Mehta', center: 'Speedy Wheels', issue: 'Mechanic was rude and unprofessional', date: '2024-11-05', priority: 'medium' as const },
    { id: 'c3', user: 'Kiran Reddy', center: 'AutoCare Pro', issue: 'Service took longer than estimated', date: '2024-11-03', priority: 'low' as const },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1300px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Platform-wide overview and management · VehicleCare Pro</p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--muted)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ padding: '7px 16px', borderRadius: '6px', border: 'none', background: activeSection === s.id ? 'var(--card)' : 'transparent', color: activeSection === s.id ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: '13px', fontWeight: activeSection === s.id ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: activeSection === s.id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Total Users" value={adminStats.totalUsers.toLocaleString()} trend={{ value: '42 this week', up: true }} icon="👥" accent="#3b82f6" />
            <StatCard label="Total Vehicles" value={adminStats.totalVehicles.toLocaleString()} sub="Across all customers" icon="🚗" accent="#8b5cf6" />
            <StatCard label="Platform Revenue" value={`₹${(adminStats.totalRevenue / 10000000).toFixed(1)}Cr`} trend={{ value: '22% YoY', up: true }} icon="💰" accent="#10b981" />
            <StatCard label="Avg Rating" value={adminStats.avgRating} sub="Out of 5.0" icon="⭐" accent="#f59e0b" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Active Centers" value={adminStats.activeCenters} sub="Live & operational" icon="🏭" accent="#ff6b2b" />
            <StatCard label="Pending Approvals" value={adminStats.pendingApprovals} sub="Centers awaiting review" icon="⏳" accent="#f59e0b" />
            <StatCard label="Open Complaints" value={adminStats.openComplaints} sub="Requires attention" icon="⚠️" accent="#ef4444" />
            <StatCard label="Total Bookings" value={adminStats.totalBookings.toLocaleString()} trend={{ value: '15% this month', up: true }} icon="📅" accent="#6b7280" />
          </div>

          {/* Chart + recent bookings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Platform Revenue & Bookings</h3>
              <BarChart data={revenueData} />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Recent Bookings</h3>
              </div>
              <div style={{ padding: '8px' }}>
                {mockBookings.slice(0, 5).map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{b.customerName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{b.serviceType} · {b.scheduledDate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={b.status} />
                      <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', marginTop: '3px' }}>₹{(b.actualCost ?? b.estimatedCost).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'users' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>All Users ({mockUsers.length})</h3>
            <input placeholder="Search users..." style={{ padding: '7px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--foreground)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none', width: '220px' }} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User', 'Email', 'Role', 'Phone', 'Join Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff6b2b22', border: '2px solid #ff6b2b55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#ff6b2b' }}>{u.avatar}</div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={u.role === 'customer' ? 'info' : u.role === 'admin' ? 'error' : 'success'} label={u.role} /></td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{u.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{u.joinDate}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 10px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                      {u.role !== 'admin' && <button style={{ padding: '4px 10px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Suspend</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'centers' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Service Centers</h3>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockServiceCenters.map(sc => (
              <div key={sc.id} style={{ display: 'flex', gap: '14px', padding: '14px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--muted)' }}>
                  <img src={sc.image} alt={sc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{sc.name}</div>
                    <Badge variant={sc.status} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{sc.address}, {sc.city} · {sc.phone}</div>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>★ {sc.rating} ({sc.totalReviews} reviews)</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                  {sc.status === 'pending' && (
                    <>
                      <button style={{ padding: '6px 14px', background: '#10b98122', color: '#10b981', border: '1px solid #10b98133', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Approve</button>
                      <button style={{ padding: '6px 14px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Reject</button>
                    </>
                  )}
                  {sc.status === 'active' && (
                    <button style={{ padding: '6px 14px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Manage</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'complaints' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Customer Complaints ({mockComplaints.length} open)</h3>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockComplaints.map(c => (
              <div key={c.id} style={{ padding: '14px', border: `1px solid ${c.priority === 'high' ? '#ef444433' : c.priority === 'medium' ? '#f59e0b33' : 'var(--border)'}`, borderRadius: '8px', background: c.priority === 'high' ? '#ef444408' : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{c.issue}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: c.priority === 'high' ? '#ef444422' : c.priority === 'medium' ? '#f59e0b22' : '#6b728022', color: c.priority === 'high' ? '#ef4444' : c.priority === 'medium' ? '#f59e0b' : '#9ca3af', textTransform: 'uppercase' }}>{c.priority}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  From: {c.user} · Center: {c.center} · {c.date}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '5px 12px', background: '#3b82f622', color: '#3b82f6', border: '1px solid #3b82f633', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Investigate</button>
                  <button style={{ padding: '5px 12px', background: '#10b98122', color: '#10b981', border: '1px solid #10b98133', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Resolve</button>
                  <button style={{ padding: '5px 12px', background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
