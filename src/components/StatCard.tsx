interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  trend?: { value: string; up: boolean };
  icon?: string;
}

export default function StatCard({ label, value, sub, accent = 'var(--primary)', trend, icon }: StatCardProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: accent, borderRadius: '10px 0 0 10px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        {icon && <div style={{ fontSize: '20px', opacity: 0.5 }}>{icon}</div>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>{value}</div>
      {(sub || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sub && <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{sub}</span>}
          {trend && <span style={{ fontSize: '12px', fontWeight: 600, color: trend.up ? '#10b981' : '#ef4444' }}>{trend.up ? '↑' : '↓'} {trend.value}</span>}
        </div>
      )}
    </div>
  );
}
