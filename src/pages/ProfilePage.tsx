import type { User } from '../types';

export default function ProfilePage({ user }: { user: User }) {
  return (
    <div style={{ padding: '28px 32px', maxWidth: '700px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>My Profile</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ff6b2b22', border: '3px solid #ff6b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#ff6b2b' }}>{user.avatar}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{user.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{user.email}</div>
          <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '3px', textTransform: 'capitalize' }}>{user.role}</div>
        </div>
        <button style={{ marginLeft: 'auto', padding: '8px 16px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--foreground)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Change Photo</button>
      </div>

      {/* Edit form */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '20px' }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {[
            ['Full Name', user.name, 'text'],
            ['Email Address', user.email, 'email'],
            ['Phone Number', user.phone ?? '', 'tel'],
            ['Member Since', user.joinDate, 'text'],
          ].map(([label, value, type]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</label>
              <input type={type} defaultValue={value} disabled={label === 'Member Since'} style={{ width: '100%', padding: '10px 14px', background: label === 'Member Since' ? 'var(--secondary)' : 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: label === 'Member Since' ? 'var(--muted-foreground)' : 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none', cursor: label === 'Member Since' ? 'default' : 'text' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '12px' }}>Change Password</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {['Current Password', 'New Password', 'Confirm Password'].map(l => (
              <div key={l}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{l}</label>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save Changes</button>
          <button style={{ padding: '10px 24px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
