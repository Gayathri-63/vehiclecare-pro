import { useState } from 'react';
import type { User } from '../types';
import { mockVehicles } from '../mockData';
import Badge from '../components/Badge';

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Fair' : 'Poor';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Health Score</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score} — {label}</span>
      </div>
      <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

export default function VehiclesPage({ user }: { user: User }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const vehicles = mockVehicles.filter(v => v.ownerId === user.id);

  const selectedVehicle = vehicles.find(v => v.id === selected);

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>My Vehicles</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{vehicles.length} registered vehicles</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          + Add Vehicle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {vehicles.map(v => (
          <div key={v.id}
            onClick={() => setSelected(selected === v.id ? null : v.id)}
            style={{ background: 'var(--card)', border: `1px solid ${selected === v.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ position: 'relative', height: '160px', background: 'var(--muted)' }}>
              <img src={v.image} alt={v.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Badge variant={v.healthScore >= 80 ? 'active' : v.healthScore >= 60 ? 'pending' : 'error'} label={`${v.healthScore}%`} />
              </div>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{v.licensePlate}</span>
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--foreground)' }}>{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{v.color} · {v.fuelType}</div>
                </div>
              </div>
              <HealthBar score={v.healthScore} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                {[
                  ['Mileage', `${v.mileage.toLocaleString()} km`],
                  ['Last Service', v.lastService],
                  ['VIN', v.vin.slice(0, 10) + '...'],
                  ['Next Due', v.nextServiceDue],
                ].map(([l, val]) => (
                  <div key={l} style={{ background: 'var(--muted)', borderRadius: '6px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{l}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', fontFamily: l === 'VIN' ? 'var(--font-mono)' : 'inherit' }}>{val}</div>
                  </div>
                ))}
              </div>
              {selected === v.id && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '8px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Book Service</button>
                  <button style={{ flex: 1, padding: '8px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                  <button style={{ padding: '8px 12px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', width: '480px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '20px' }}>Add New Vehicle</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['Make', 'e.g. Maruti Suzuki'], ['Model', 'e.g. Swift'], ['Year', '2023'], ['License Plate', 'KA 01 AB 1234'], ['VIN', 'Vehicle ID Number'], ['Color', 'e.g. Pearl White'], ['Mileage (km)', '0'], ['Fuel Type', 'Petrol']].map(([l, ph]) => (
                <div key={l}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{l}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '9px 12px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--foreground)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
