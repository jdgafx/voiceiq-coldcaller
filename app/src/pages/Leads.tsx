import { leadOutcomes } from '../data/playbook';
import { Clock, AlertTriangle } from 'lucide-react';
import ScriptVar from '../components/ScriptVar';

export default function Leads() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Lead Outcomes & Disposition</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Log every call outcome correctly. The right disposition determines the right next action.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 32 }}>
        {leadOutcomes.map(outcome => (
          <div
            key={outcome.label}
            style={{ background: outcome.bg, border: `1px solid ${outcome.border}`, borderRadius: 12, padding: '22px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: outcome.color, opacity: 0.7 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{outcome.emoji}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: outcome.color }}>{outcome.label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{outcome.definition}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Alex's Close Line</div>
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic' }}>
                <ScriptVar text={outcome.close} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Next Action</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{outcome.next}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 12 }}>
          <Clock size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>Call Hours (TCPA)</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>Only call between <strong style={{ color: '#fbbf24' }}>8:00 AM and 9:00 PM</strong> prospect local time. Violations are regulatory infractions.</div>
          </div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 12 }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>Retry Limit</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>Maximum <strong style={{ color: '#f87171' }}>2 retry attempts</strong> per contact (TCPA-safe limit). Second voicemail after 48hrs minimum.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
