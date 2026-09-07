import { useState } from 'react';
import type { User } from '../types';
import { mockUsers } from '../mockData';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const demoAccounts = [
  { role: 'Customer', email: 'customer@demo.com', color: '#3b82f6', icon: '🚗' },
  { role: 'Center Owner', email: 'owner@demo.com', color: '#10b981', icon: '🏭' },
  { role: 'Mechanic', email: 'mechanic@demo.com', color: '#f59e0b', icon: '🔧' },
  { role: 'Admin', email: 'admin@demo.com', color: '#ff6b2b', icon: '👑' },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('customer@demo.com');
  const [password, setPassword] = useState('demo123');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Use one of the demo accounts below.');
    }
  }

  function quickLogin(email: string) {
    const user = mockUsers.find(u => u.email === email);
    if (user) onLogin(user);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', fontFamily: 'var(--font-sans)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px', background: 'linear-gradient(135deg, #0f1117 0%, #1a1f30 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #ff6b2b15 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, #3b82f610 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
            <div style={{ width: '52px', height: '52px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: '#fff' }}>V</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--foreground)', lineHeight: 1.1 }}>VehicleCare Pro</div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>AI-Powered Vehicle Management</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.15, marginBottom: '16px' }}>
            Smart Care for<br />
            <span style={{ color: 'var(--primary)' }}>Every Vehicle</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
            AI-driven health scores, predictive maintenance alerts, instant service booking, and real-time tracking — all in one platform.
          </p>

          {/* Feature bullets */}
          {['AI Vehicle Health Score & Predictions', 'Real-time Service Tracking', 'Seamless Online Payments & Invoices', 'Nearby Service Center Finder'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ff6b2b22', border: '1px solid #ff6b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#ff6b2b', flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: '14px', color: 'var(--secondary-foreground)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Form */}
      <div style={{ width: '460px', minWidth: '460px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', background: 'var(--card)', borderLeft: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '6px' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{isRegister ? 'Start managing your vehicles today' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Arjun Sharma" style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
          </div>
          {error && <p style={{ fontSize: '13px', color: '#ef4444', padding: '8px 12px', background: '#ef444415', borderRadius: '6px', border: '1px solid #ef444433' }}>{error}</p>}
          <button type="submit" style={{ padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', marginTop: '4px' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>

        {/* Demo accounts */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', textAlign: 'center' }}>Quick Demo Access</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc.email)}
                style={{ padding: '10px 12px', background: acc.color + '15', border: `1px solid ${acc.color}33`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = acc.color + '25'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = acc.color + '15'; }}
              >
                <span style={{ fontSize: '16px' }}>{acc.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: acc.color }}>{acc.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
