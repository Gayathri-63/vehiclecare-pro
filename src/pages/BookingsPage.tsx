import { useState } from 'react';
import type { User } from '../types';
import { mockBookings, mockVehicles, mockServiceCenters } from '../mockData';
import Badge from '../components/Badge';
import PaymentModal from '../components/PaymentModal';

const SERVICE_TYPES = ['Full Service', 'Oil Change', 'Brake Service', 'AC Repair', 'Tyre Service', 'Engine Diagnostics', 'Denting & Painting', 'Wheel Alignment', 'Battery Check', 'EV Service'];

const COST_MAP: Record<string, number> = {
  'Full Service': 3200, 'Oil Change': 800, 'Brake Service': 1800, 'AC Repair': 2500,
  'Tyre Service': 1200, 'Engine Diagnostics': 1500, 'Denting & Painting': 5000,
  'Wheel Alignment': 600, 'Battery Check': 1000, 'EV Service': 2000,
};

export default function BookingsPage({ user }: { user: User }) {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const myVehicles = mockVehicles.filter(v => v.ownerId === user.id);
  const myBookings = mockBookings.filter(b => b.customerId === user.id);
  const estimatedCost = COST_MAP[selectedService] ?? 0;

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  function handleBook() {
    setBooked(true);
    setTimeout(() => { setBooked(false); setStep(1); setSelectedVehicle(''); setSelectedCenter(''); setSelectedService(''); setSelectedDate(''); setSelectedTime(''); setNotes(''); }, 3000);
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Book a Service</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Schedule vehicle maintenance at a nearby service center</p>
      </div>

      {booked ? (
        <div style={{ background: '#10b98115', border: '1px solid #10b981', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>You will receive a confirmation notification shortly.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          {/* Booking form */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Steps */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {['Vehicle', 'Service', 'Schedule', 'Confirm'].map((s, i) => (
                <div key={s} style={{ flex: 1, padding: '14px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none', background: step === i + 1 ? 'var(--primary)' : step > i + 1 ? '#10b98115' : 'transparent', cursor: 'pointer' }}
                  onClick={() => step > i + 1 && setStep(i + 1)}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: step === i + 1 ? '#fff' : step > i + 1 ? '#10b981' : 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '24px' }}>
              {/* Step 1: Vehicle */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Select Your Vehicle</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {myVehicles.map(v => (
                      <div key={v.id} onClick={() => setSelectedVehicle(v.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: `2px solid ${selectedVehicle === v.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', background: selectedVehicle === v.id ? 'var(--primary)10' : 'transparent', transition: 'all 0.15s' }}>
                        <div style={{ width: '56px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: 'var(--muted)', flexShrink: 0 }}>
                          <img src={v.image} alt={v.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{v.year} {v.make} {v.model}</div>
                          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{v.licensePlate} · {v.mileage.toLocaleString()} km</div>
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedVehicle === v.id ? 'var(--primary)' : 'var(--border)'}`, background: selectedVehicle === v.id ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff' }}>
                          {selectedVehicle === v.id && '✓'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button disabled={!selectedVehicle} onClick={() => setStep(2)} style={{ marginTop: '20px', width: '100%', padding: '11px', background: selectedVehicle ? 'var(--primary)' : 'var(--muted)', color: selectedVehicle ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: selectedVehicle ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Service & Center */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Select Service & Center</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Service Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {SERVICE_TYPES.map(s => (
                        <button key={s} onClick={() => setSelectedService(s)} style={{ padding: '9px 12px', border: `2px solid ${selectedService === s ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '6px', background: selectedService === s ? '#ff6b2b15' : 'transparent', color: selectedService === s ? 'var(--primary)' : 'var(--foreground)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: selectedService === s ? 600 : 400 }}>
                          {s}
                          {selectedService === s && <span style={{ float: 'right', color: 'var(--primary)' }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Service Center</label>
                    {mockServiceCenters.filter(sc => sc.status === 'active').map(sc => (
                      <div key={sc.id} onClick={() => setSelectedCenter(sc.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: `2px solid ${selectedCenter === sc.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', background: selectedCenter === sc.id ? '#ff6b2b08' : 'transparent' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{sc.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{sc.address}, {sc.city}</div>
                          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>{'★'.repeat(Math.floor(sc.rating))} {sc.rating} ({sc.totalReviews} reviews)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, padding: '11px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← Back</button>
                    <button disabled={!selectedService || !selectedCenter} onClick={() => setStep(3)} style={{ flex: 2, padding: '11px', background: selectedService && selectedCenter ? 'var(--primary)' : 'var(--muted)', color: selectedService && selectedCenter ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: selectedService && selectedCenter ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>Continue →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Schedule Date & Time</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Date</label>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Time Slot</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {times.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: '9px', border: `2px solid ${selectedTime === t ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '6px', background: selectedTime === t ? '#ff6b2b15' : 'transparent', color: selectedTime === t ? 'var(--primary)' : 'var(--foreground)', fontSize: '12px', fontWeight: selectedTime === t ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Describe any issues or special instructions..." style={{ width: '100%', padding: '10px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, padding: '11px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← Back</button>
                    <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(4)} style={{ flex: 2, padding: '11px', background: selectedDate && selectedTime ? 'var(--primary)' : 'var(--muted)', color: selectedDate && selectedTime ? '#fff' : 'var(--muted-foreground)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>Review →</button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Confirm Booking</h3>
                  <div style={{ background: 'var(--muted)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {[
                      ['Vehicle', myVehicles.find(v => v.id === selectedVehicle)?.make + ' ' + myVehicles.find(v => v.id === selectedVehicle)?.model],
                      ['Service', selectedService],
                      ['Center', mockServiceCenters.find(s => s.id === selectedCenter)?.name],
                      ['Date', selectedDate],
                      ['Time', selectedTime],
                      ['Est. Cost', `₹${estimatedCost.toLocaleString()}`],
                    ].map(([l, val]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{l}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', fontFamily: l === 'Est. Cost' ? 'var(--font-mono)' : 'inherit' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px', background: 'var(--muted)', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px' }}>💳</span>
                    <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>You can pay now or after service completion</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(3)} style={{ flex: 1, padding: '11px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← Back</button>
                    <button onClick={handleBook} style={{ flex: 1, padding: '11px', background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Book, Pay Later</button>
                    <button onClick={() => setShowPayModal(true)} style={{ flex: 2, padding: '11px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      💳 Book & Pay Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking history */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '14px' }}>Recent Bookings</h3>
            {myBookings.slice(0, 5).map(b => (
              <div key={b.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{b.serviceType}</span>
                  <Badge variant={b.status} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{b.vehicleName} · {b.scheduledDate}</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>₹{(b.actualCost ?? b.estimatedCost).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPayModal && (
        <PaymentModal
          amount={estimatedCost}
          bookingId={`bk${Date.now().toString().slice(-6)}`}
          serviceType={selectedService}
          vehicleName={myVehicles.find(v => v.id === selectedVehicle)?.make + ' ' + myVehicles.find(v => v.id === selectedVehicle)?.model}
          onSuccess={() => {
            setShowPayModal(false);
            setBooked(true);
            setTimeout(() => { setBooked(false); setStep(1); setSelectedVehicle(''); setSelectedCenter(''); setSelectedService(''); setSelectedDate(''); setSelectedTime(''); setNotes(''); }, 3000);
          }}
          onClose={() => setShowPayModal(false)}
        />
      )}
    </div>
  );
}
