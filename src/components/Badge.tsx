type BadgeVariant = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'active' | 'suspended' | 'paid' | 'refunded' | 'info' | 'success' | 'warning' | 'error';

const styles: Record<BadgeVariant, { bg: string; color: string; label: string }> = {
  pending: { bg: '#f59e0b22', color: '#f59e0b', label: 'Pending' },
  confirmed: { bg: '#3b82f622', color: '#3b82f6', label: 'Confirmed' },
  'in-progress': { bg: '#8b5cf622', color: '#8b5cf6', label: 'In Progress' },
  completed: { bg: '#10b98122', color: '#10b981', label: 'Completed' },
  cancelled: { bg: '#ef444422', color: '#ef4444', label: 'Cancelled' },
  active: { bg: '#10b98122', color: '#10b981', label: 'Active' },
  suspended: { bg: '#ef444422', color: '#ef4444', label: 'Suspended' },
  paid: { bg: '#10b98122', color: '#10b981', label: 'Paid' },
  refunded: { bg: '#6b728022', color: '#9ca3af', label: 'Refunded' },
  info: { bg: '#3b82f622', color: '#3b82f6', label: 'Info' },
  success: { bg: '#10b98122', color: '#10b981', label: 'Success' },
  warning: { bg: '#f59e0b22', color: '#f59e0b', label: 'Warning' },
  error: { bg: '#ef444422', color: '#ef4444', label: 'Error' },
};

export default function Badge({ variant, label }: { variant: BadgeVariant; label?: string }) {
  const s = styles[variant];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-block' }}>
      {label ?? s.label}
    </span>
  );
}
