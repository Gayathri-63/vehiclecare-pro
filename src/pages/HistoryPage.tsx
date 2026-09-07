import type { User } from '../types';
import { mockBookings } from '../mockData';
import Badge from '../components/Badge';

export default function HistoryPage({ user }: { user: User }) {
  const isMechanic = user.role === 'mechanic';
  const bookings = isMechanic
    ? mockBookings.filter(b => b.mechanicId === user.id)
    : user.role === 'customer'
    ? mockBookings.filter(b => b.customerId === user.id)
    : mockBookings;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>
          {isMechanic ? 'Completed Jobs' : 'Service History'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{bookings.length} service records</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {bookings.map(b => (
          <div key={b.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>{b.serviceType}</div>
                <Badge variant={b.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
                {[
                  ['Vehicle', b.vehicleName],
                  ['Service Center', b.serviceCenterName],
                  ['Mechanic', b.mechanicName ?? 'Not assigned'],
                  ['Date', b.scheduledDate],
                  ['Time', b.scheduledTime],
                  ['Cost', `₹${(b.actualCost ?? b.estimatedCost).toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: 'var(--muted)', borderRadius: '6px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{l}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', fontFamily: l === 'Cost' ? 'var(--font-mono)' : 'inherit' }}>{v}</div>
                  </div>
                ))}
              </div>
              {b.notes && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f59e0b15', border: '1px solid #f59e0b33', borderRadius: '6px', fontSize: '12px', color: '#f59e0b' }}>
                  📌 {b.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
