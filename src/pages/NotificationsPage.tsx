import type { User } from '../types';
import { mockNotifications } from '../mockData';
import Badge from '../components/Badge';

export default function NotificationsPage({ user }: { user: User }) {
  const notifications = mockNotifications.filter(n => n.userId === user.id);
  const unread = notifications.filter(n => !n.read);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Notifications</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{unread.length} unread</p>
        </div>
        <button style={{ padding: '8px 16px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted-foreground)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Mark all read</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{ padding: '16px 18px', background: n.read ? 'var(--card)' : 'var(--card)', border: `1px solid ${n.read ? 'var(--border)' : '#ff6b2b44'}`, borderRadius: '10px', display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
            {!n.read && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
            <div style={{ paddingTop: '2px' }}><Badge variant={n.type} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>{n.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{n.message}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                {new Date(n.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
