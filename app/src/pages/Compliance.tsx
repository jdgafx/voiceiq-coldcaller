import { complianceRules } from '../data/playbook';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Compliance() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(239,68,68,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Non-Negotiable</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>Compliance Rules</h1>
          </div>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>TCPA & Insurance Regulatory Requirements — these rules apply to every call, every time.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {complianceRules.map((rule, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10, padding: '16px 18px' }}>
            <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{rule}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '20px 22px', display: 'flex', gap: 14, marginBottom: 24 }}>
        <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>WARNING</div>
          <p style={{ margin: 0, fontSize: 13, color: '#fca5a5', lineHeight: 1.6 }}>
            Violations may result in regulatory fines, license suspension, and legal liability. All agents are responsible for knowing and following applicable federal and state regulations at all times.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#475569', fontWeight: 600 }}>Combined Insurance • A Chubb Company</p>
        <p style={{ margin: 0, fontSize: 11, color: '#334155' }}>A+ AM Best Rating • A+ BBB • 100+ Years of Service • 54 Countries</p>
        <p style={{ margin: '8px 0 0', fontSize: 10, color: '#1e293b' }}>For agent use only — not for public distribution</p>
      </div>
    </div>
  );
}
