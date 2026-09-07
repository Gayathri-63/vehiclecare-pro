import { useState } from 'react';
import type { User } from '../types';
import { mockVehicles } from '../mockData';

function ScoreArc({ score, size = 160 }: { score: number; size?: number }) {
  const center = size / 2;
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const angle = (score / 100) * 0.75;
  const dash = angle * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const startAngle = -Math.PI * 0.875;
  const endAngle = startAngle + angle * 2 * Math.PI;
  const x1 = center + r * Math.cos(startAngle);
  const y1 = center + r * Math.sin(startAngle);
  const x2 = center + r * Math.cos(endAngle);
  const y2 = center + r * Math.sin(endAngle);
  const largeArc = angle > 0.5 ? 1 : 0;
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

  return (
    <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.75}`}>
      <path d={`M ${center + r * Math.cos(-Math.PI * 0.875)} ${center + r * Math.sin(-Math.PI * 0.875)} A ${r} ${r} 0 1 1 ${center + r * Math.cos(-Math.PI * 0.125)} ${center + r * Math.sin(-Math.PI * 0.125)}`} fill="none" stroke="var(--muted)" strokeWidth="12" strokeLinecap="round" />
      {score > 0 && (
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${color}66)` }} />
      )}
      <text x={center} y={center * 1.1} textAnchor="middle" fill={color} fontSize={size * 0.22} fontWeight="800" fontFamily="var(--font-display)">{score}</text>
      <text x={center} y={center * 1.35} textAnchor="middle" fill="var(--muted-foreground)" fontSize={size * 0.09} fontWeight="600" fontFamily="var(--font-sans)">{grade} HEALTH GRADE</text>
    </svg>
  );
}

const FACTORS = [
  { key: 'age', label: 'Vehicle Age', desc: 'Years since manufacture', weight: 20 },
  { key: 'mileage', label: 'Mileage Efficiency', desc: 'km per year compared to average', weight: 25 },
  { key: 'service', label: 'Service Regularity', desc: 'On-time maintenance history', weight: 30 },
  { key: 'repairs', label: 'Repair Frequency', desc: 'Major repairs in last 12 months', weight: 25 },
];

const PREDICTIONS = [
  { service: 'Engine Oil Change', due: '2025-02-10', confidence: 96, urgency: 'high', cost: 800 },
  { service: 'Air Filter Replacement', due: '2025-03-15', confidence: 88, urgency: 'medium', cost: 450 },
  { service: 'Brake Pad Inspection', due: '2025-04-01', confidence: 74, urgency: 'low', cost: 600 },
  { service: 'Tyre Rotation', due: '2025-05-20', confidence: 82, urgency: 'low', cost: 350 },
];

const CHATBOT_FAQS = [
  'What affects my vehicle health score?',
  'When should I replace my brake pads?',
  'How often should I change engine oil?',
  'What does the check engine light mean?',
];

const CHATBOT_ANSWERS: Record<string, string> = {
  'What affects my vehicle health score?': 'Your AI health score is calculated from 4 factors: vehicle age (20%), mileage efficiency (25%), service regularity (30%), and repair frequency (25%). Regular on-time servicing has the highest positive impact.',
  'When should I replace my brake pads?': 'Brake pads typically last 30,000–70,000 km. You should replace them if you hear squealing sounds, feel vibration while braking, or your brake pad warning light activates. AI prediction recommends inspection every 20,000 km.',
  'How often should I change engine oil?': 'For synthetic oil: every 10,000–15,000 km or 12 months. For mineral oil: every 5,000–7,500 km or 6 months. Check your owner manual for specific recommendations.',
  'What does the check engine light mean?': 'It indicates an emissions or engine management issue. Common causes: loose fuel cap, faulty O2 sensor, catalytic converter issue, or spark plug failure. Visit a service center for a diagnostic scan.',
};

export default function AIHealthPage({ user }: { user: User }) {
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles.find(v => v.ownerId === user.id)?.id ?? '');
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I\'m your AI vehicle assistant. Ask me anything about vehicle maintenance or your health score.' }
  ]);

  const vehicle = mockVehicles.find(v => v.id === selectedVehicle);
  const myVehicles = mockVehicles.filter(v => v.ownerId === user.id);

  function sendMessage(msg: string) {
    const text = msg || chatMsg;
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setTimeout(() => {
      const answer = CHATBOT_ANSWERS[text] ?? 'Great question! Based on your vehicle data, I recommend consulting with a certified mechanic. Regular preventive maintenance is the best way to maintain a high health score and avoid costly repairs.';
      setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    }, 800);
    setChatMsg('');
  }

  const scoreFactors = vehicle ? [
    { ...FACTORS[0], score: Math.max(0, 100 - (new Date().getFullYear() - vehicle.year) * 8) },
    { ...FACTORS[1], score: vehicle.mileage < 50000 ? 90 : vehicle.mileage < 100000 ? 70 : 50 },
    { ...FACTORS[2], score: vehicle.healthScore > 80 ? 88 : 65 },
    { ...FACTORS[3], score: vehicle.healthScore > 70 ? 85 : 55 },
  ] : [];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>AI Vehicle Health Score</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Machine learning-powered insights and predictive maintenance</p>
      </div>

      {/* Vehicle selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {myVehicles.map(v => (
          <button key={v.id} onClick={() => setSelectedVehicle(v.id)}
            style={{ padding: '9px 16px', border: `2px solid ${selectedVehicle === v.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', background: selectedVehicle === v.id ? '#ff6b2b15' : 'transparent', color: selectedVehicle === v.id ? 'var(--primary)' : 'var(--foreground)', fontSize: '13px', fontWeight: selectedVehicle === v.id ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {v.year} {v.make} {v.model}
          </button>
        ))}
      </div>

      {vehicle && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Score card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScoreArc score={vehicle.healthScore} size={180} />
            <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '12px', textAlign: 'center' }}>
              {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.licensePlate}
            </div>
            <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scoreFactors.map(f => (
                <div key={f.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--foreground)' }}>{f.label}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginLeft: '6px' }}>{f.desc}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: f.score >= 80 ? '#10b981' : f.score >= 60 ? '#f59e0b' : '#ef4444' }}>{f.score}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--muted)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${f.score}%`, background: f.score >= 80 ? '#10b981' : f.score >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive maintenance */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🔮</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>Predictive Maintenance</h3>
            </div>
            <div style={{ padding: '12px' }}>
              {PREDICTIONS.map(p => (
                <div key={p.service} style={{ padding: '12px', border: `1px solid ${p.urgency === 'high' ? '#ef444433' : p.urgency === 'medium' ? '#f59e0b33' : 'var(--border)'}`, borderRadius: '8px', marginBottom: '8px', background: p.urgency === 'high' ? '#ef444408' : 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{p.service}</div>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: p.urgency === 'high' ? '#ef444422' : p.urgency === 'medium' ? '#f59e0b22' : '#6b728022', color: p.urgency === 'high' ? '#ef4444' : p.urgency === 'medium' ? '#f59e0b' : '#9ca3af', textTransform: 'uppercase' }}>{p.urgency}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Due: {p.due}</div>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{p.cost.toLocaleString()}</div>
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ height: '4px', flex: 1, background: 'var(--muted)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${p.confidence}%`, background: '#3b82f6', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{p.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #ff6b2b08 0%, transparent 100%)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px #10b98133' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>AI Vehicle Assistant</span>
          <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginLeft: '4px' }}>Online · Powered by VehicleCare AI</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
          <div>
            <div style={{ height: '220px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '10px', background: m.role === 'user' ? 'var(--primary)' : 'var(--muted)', color: m.role === 'user' ? '#fff' : 'var(--foreground)', fontSize: '13px', lineHeight: 1.5 }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage('')} placeholder="Ask about your vehicle..." style={{ flex: 1, padding: '9px 14px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
              <button onClick={() => sendMessage('')} style={{ padding: '9px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Send</button>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Quick Questions</div>
            {CHATBOT_FAQS.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{ display: 'block', width: '100%', padding: '8px 10px', background: 'var(--muted)', border: 'none', borderRadius: '6px', color: 'var(--secondary-foreground)', fontSize: '11px', cursor: 'pointer', textAlign: 'left', marginBottom: '6px', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
