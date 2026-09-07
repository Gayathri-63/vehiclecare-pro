import type { User, Page } from '../types';
import { mockVehicles, mockBookings, mockNotifications } from '../mockData';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

interface Props {
  user: User;
  onPageChange: (page: Page) => void;
}

function HealthRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="44" y="49" textAnchor="middle" fill={color} fontSize="16" fontWeight="700"
        fontFamily="var(--font-display)" style={{ transform: 'rotate(90deg)', transformOrigin: '44px 44px' }}>
        {score}
      </text>
    </svg>
  );
}

export default function CustomerDashboard({ user, onPageChange }: Props) {
  const myVehicles = mockVehicles.filter(v => v.ownerId === user.id);
  const myBookings = mockBookings.filter(b => b.customerId === user.id);
  const unreadNotifs = mockNotifications.filter(n => n.userId === user.id && !n.read).length;
  const activeBooking = myBookings.find(b => b.status === 'in-progress');
  const pendingBookings = myBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const completedBookings = myBookings.filter(b => b.status === 'completed').length;

  const avgHealth = myVehicles.length ? Math.round(myVehicles.reduce((s, v) => s + v.healthScore, 0) / myVehicles.length) : 0;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>
          Good morning, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Here's an overview of your vehicles and upcoming services.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="My Vehicles" value={myVehicles.length} sub="Registered" icon="🚗" accent="#3b82f6" />
        <StatCard label="Avg Health Score" value={`${avgHealth}`} sub="Out of 100" icon="❤️" accent="#10b981" trend={{ value: '3pts this month', up: true }} />
        <StatCard label="Active Bookings" value={pendingBookings} sub="Pending / Confirmed" icon="📅" accent="#ff6b2b" />
        <StatCard label="Completed Services" value={completedBookings} sub="All time" icon="✅" accent="#8b5cf6" />
      </div>

      {/* Active service banner */}
      {activeBooking && (
        <div style={{ background: 'linear-gradient(135deg, #ff6b2b22 0%, #8b5cf622 100%)', border: '1px solid #ff6b2b44', borderRadius: '10px', padding: '18px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6b2b', boxShadow: '0 0 0 4px #ff6b2b33', animation: 'pulse 2s infinite' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
                {activeBooking.vehicleName} — Service In Progress
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                {activeBooking.serviceType} at {activeBooking.serviceCenterName} · Mechanic: {activeBooking.mechanicName}
              </div>
            </div>
          </div>
          <button onClick={() => onPageChange('history')} style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Track Live →
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Vehicles */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>My Vehicles</h3>
            <button onClick={() => onPageChange('vehicles')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>View All →</button>
          </div>
          <div style={{ padding: '12px' }}>
            {myVehicles.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '8px', marginBottom: '6px', background: 'var(--muted)', cursor: 'pointer' }}
                onClick={() => onPageChange('vehicles')}>
                <div style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--secondary)' }}>
                  <img src={v.image} alt={v.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{v.licensePlate} · {v.mileage.toLocaleString()} km</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>Next service: {v.nextServiceDue}</div>
                </div>
                <HealthRing score={v.healthScore} />
              </div>
            ))}
            <button onClick={() => onPageChange('vehicles')} style={{ width: '100%', padding: '10px', border: '1px dashed var(--border)', borderRadius: '8px', background: 'transparent', color: 'var(--muted-foreground)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginTop: '4px' }}>
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Recent bookings */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Recent Bookings</h3>
            <button onClick={() => onPageChange('history')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>View All →</button>
          </div>
          <div style={{ padding: '8px' }}>
            {myBookings.slice(0, 4).map(b => (
              <div key={b.id} style={{ padding: '12px', borderRadius: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{b.serviceType}</div>
                  <Badge variant={b.status} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{b.vehicleName}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{b.scheduledDate} · {b.serviceCenterName}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>₹{(b.actualCost ?? b.estimatedCost).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => onPageChange('bookings')} style={{ width: '100%', padding: '10px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Book a Service →
            </button>
          </div>
        </div>
      </div>

      {/* Notifications strip */}
      {unreadNotifs > 0 && (
        <div style={{ marginTop: '20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Notifications <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '10px', padding: '2px 7px', borderRadius: '10px', marginLeft: '6px' }}>{unreadNotifs}</span></h3>
            <button onClick={() => onPageChange('notifications')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockNotifications.filter(n => n.userId === user.id && !n.read).map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: 'var(--muted)', borderRadius: '8px' }}>
                <Badge variant={n.type} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{n.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{n.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
