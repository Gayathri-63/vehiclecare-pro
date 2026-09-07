import type { UserRole, Page } from '../types';

interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

const navByRole: Record<UserRole, NavItem[]> = {
  customer: [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'vehicles', label: 'My Vehicles', icon: '🚗' },
    { id: 'bookings', label: 'Book Service', icon: '📅' },
    { id: 'history', label: 'Service History', icon: '📋' },
    { id: 'ai-health', label: 'AI Health Score', icon: '🤖' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  owner: [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'service-centers', label: 'Service Centers', icon: '🏭' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'mechanics', label: 'Mechanics', icon: '🔧' },
    { id: 'analytics', label: 'Revenue & Analytics', icon: '📊' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  mechanic: [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'jobs', label: 'My Jobs', icon: '🔧' },
    { id: 'repairs', label: 'Repair Notes', icon: '📝' },
    { id: 'history', label: 'Completed Jobs', icon: '✅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'service-centers', label: 'Service Centers', icon: '🏭' },
    { id: 'bookings', label: 'All Bookings', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'payments', label: 'Revenue', icon: '💰' },
    { id: 'complaints', label: 'Complaints', icon: '⚠️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
};

const roleLabels: Record<UserRole, string> = {
  customer: 'Customer',
  owner: 'Center Owner',
  mechanic: 'Mechanic',
  admin: 'Administrator',
};

const roleColors: Record<UserRole, string> = {
  customer: '#3b82f6',
  owner: '#10b981',
  mechanic: '#f59e0b',
  admin: '#ff6b2b',
};

interface SidebarProps {
  role: UserRole;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  userName: string;
  userAvatar: string;
  onLogout: () => void;
  notificationCount?: number;
}

export default function Sidebar({ role, currentPage, onPageChange, userName, userAvatar, onLogout, notificationCount = 0 }: SidebarProps) {
  const navItems = navByRole[role];

  return (
    <aside style={{ width: '240px', minWidth: '240px', background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#fff', flexShrink: 0 }}>V</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--foreground)', lineHeight: 1.2 }}>VehicleCare</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '11px', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pro</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: roleColors[role] + '22', border: `2px solid ${roleColors[role]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: roleColors[role], flexShrink: 0 }}>{userAvatar}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: roleColors[role], fontWeight: 500 }}>{roleLabels[role]}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
        {navItems.map(item => {
          const isActive = item.id === currentPage;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--muted-foreground)',
                fontSize: '13.5px', fontWeight: isActive ? 600 : 400,
                marginBottom: '2px', textAlign: 'left', transition: 'all 0.15s',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)'; }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-foreground)'; } }}
            >
              <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'notifications' && notificationCount > 0 && (
                <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center' }}>{notificationCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onLogout}
          style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted-foreground)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ef444422'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
        >
          <span>→</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
