import { useState } from 'react';
import type { User } from '../types';
import { mockBookings } from '../mockData';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';

export default function MechanicDashboard({ user }: { user: User }) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const myJobs = mockBookings.filter(b => b.mechanicId === user.id);
  const activeJobs = myJobs.filter(b => b.status === 'in-progress');
  const pendingJobs = myJobs.filter(b => b.status === 'confirmed');
  const completedJobs = myJobs.filter(b => b.status === 'completed');

  const selectedBooking = myJobs.find(b => b.id === selectedJob);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>
          Mechanic Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Welcome back, {user.name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Active Jobs" value={activeJobs.length} sub="Currently working on" icon="🔧" accent="#ff6b2b" />
        <StatCard label="Pending Jobs" value={pendingJobs.length} sub="Assigned & upcoming" icon="⏳" accent="#f59e0b" />
        <StatCard label="Completed" value={completedJobs.length} sub="This month" icon="✅" accent="#10b981" trend={{ value: '2 today', up: true }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Jobs list */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>My Assigned Jobs</h3>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myJobs.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '14px' }}>No jobs assigned yet.</div>
            )}
            {myJobs.map(job => (
              <div key={job.id}
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                style={{ padding: '14px', border: `2px solid ${selectedJob === job.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', background: selectedJob === job.id ? '#ff6b2b08' : 'transparent', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{job.serviceType}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{job.vehicleName}</div>
                  </div>
                  <Badge variant={job.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                    👤 {job.customerName} · 📅 {job.scheduledDate} {job.scheduledTime}
                  </div>
                  <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>₹{(job.actualCost ?? job.estimatedCost).toLocaleString()}</div>
                </div>
                {job.notes && (
                  <div style={{ marginTop: '6px', padding: '6px 10px', background: '#f59e0b15', borderRadius: '5px', fontSize: '12px', color: '#f59e0b' }}>
                    📌 {job.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job details panel */}
        {selectedJob && selectedBooking && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Job Details</h3>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Details */}
              <div style={{ background: 'var(--muted)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  ['Customer', selectedBooking.customerName],
                  ['Vehicle', selectedBooking.vehicleName],
                  ['Service', selectedBooking.serviceType],
                  ['Service Center', selectedBooking.serviceCenterName],
                  ['Scheduled', `${selectedBooking.scheduledDate} ${selectedBooking.scheduledTime}`],
                  ['Est. Cost', `₹${selectedBooking.estimatedCost.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{l}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Update status */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Update Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['confirmed', 'in-progress', 'completed'].map(s => (
                    <button key={s} style={{ padding: '9px', border: `2px solid ${selectedBooking.status === s ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '6px', background: selectedBooking.status === s ? '#ff6b2b15' : 'transparent', color: selectedBooking.status === s ? 'var(--primary)' : 'var(--foreground)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repair notes */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Repair Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add repair details, parts replaced, observations..." style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }} />
              </div>

              {/* Upload photos */}
              <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📷</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Click to upload repair photos</div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>PNG, JPG up to 10MB</div>
              </div>

              <button style={{ width: '100%', padding: '11px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Save Updates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
