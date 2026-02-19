import { products, competitorData } from '../data/playbook';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

const personas = [
  {
    type: 'Persona A',
    icon: '🏢',
    label: 'HR / Benefits Decision Maker',
    color: '#3b82f6',
    title: 'HR Manager, Benefits Administrator, VP HR, CFO, Business Owner',
    size: '5–500 employees (sweet spot: 25–150)',
    pain: ['Competing for talent with bigger companies', 'Rising health insurance premiums squeezing benefits budget', 'Employees asking for better benefits but budget is fixed', 'High turnover hurting morale and productivity'],
    language: ['"Total compensation package"', '"Benefits competitiveness"', '"Zero cost to employer"', '"Retention"', '"Enrollment support"'],
  },
  {
    type: 'Persona B',
    icon: '👤',
    label: 'Individual / Employee',
    color: '#14b8a6',
    title: 'Working adults 25–55 | Families with dependents | Hourly & salaried | Self-employed',
    size: 'Individual or family coverage',
    pain: ['High deductibles on their health plan (HDHP)', 'Fear of unexpected medical bills derailing finances', 'Watching a family member go through cancer / serious illness', 'Self-employed with no employer benefits'],
    language: ['"Out-of-pocket costs"', '"Pays directly to me"', '"Peace of mind"', '"What happens if..."', '"Is my family protected?"'],
  },
];

function Rating({ value, carrier }: { value: string; carrier: 'combined' | 'other' }) {
  if (carrier === 'combined') {
    return <span style={{ color: '#60a5fa', fontWeight: 600 }}><CheckCircle size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle', color: '#10b981' }} />{value}</span>;
  }
  if (value === 'Less specialized' || value === 'Mid-large employers only') {
    return <span style={{ color: '#64748b' }}><MinusCircle size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />{value}</span>;
  }
  return <span style={{ color: '#94a3b8' }}>{value}</span>;
}

export default function Products() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 12px', letterSpacing: '-0.5px' }}>Product Intelligence</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14, maxWidth: 600, lineHeight: 1.6 }}>
          Combined Insurance pays cash benefits directly to the policyholder — not to hospitals, not to doctors — when a covered event occurs. These benefits supplement — not replace — major medical insurance.
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>The Full Product Suite</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {products.map(product => (
            <div key={product.name} className="glass-card" style={{ padding: '20px', borderLeft: `3px solid ${product.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{product.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{product.name}</span>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px', lineHeight: 1.6 }}>{product.description}</p>
              <div style={{ background: `${product.color}10`, border: `1px solid ${product.color}25`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: product.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Talking Point</div>
                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>"{product.hook}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Target Buyer Personas</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {personas.map(p => (
            <div key={p.type} className="glass-card" style={{ padding: '22px', borderTop: `3px solid ${p.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.type}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{p.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, fontStyle: 'italic' }}>{p.title}</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>PAIN POINTS</div>
                {p.pain.map(pt => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    <XCircle size={11} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>THEIR LANGUAGE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.language.map(l => (
                    <span key={l} style={{ padding: '3px 8px', background: `${p.color}12`, border: `1px solid ${p.color}25`, borderRadius: 12, fontSize: 11, color: p.color }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Competitor Comparison — Combined vs Aflac vs Unum</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}>Factor</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', fontWeight: 700, borderBottom: '2px solid rgba(59,130,246,0.4)', fontSize: 12 }}>✓ Combined Insurance</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}>Aflac</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}>Unum</th>
              </tr>
            </thead>
            <tbody>
              {competitorData.rows.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>{row.label}</td>
                  <td style={{ padding: '11px 16px', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid rgba(59,130,246,0.1)', fontSize: 12 }}>
                    <Rating value={row.combined} carrier="combined" />
                  </td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                    <Rating value={row.aflac} carrier="other" />
                  </td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                    <Rating value={row.unum} carrier="other" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderLeft: '3px solid #3b82f6' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Chubb Credibility Statement</div>
        <p style={{ margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, fontStyle: 'italic' }}>
          "Combined Insurance is backed by Chubb — the world's largest publicly traded property and casualty insurance company, operating in 54 countries with an A+ Superior rating from AM Best. When you choose Combined, you're choosing global financial strength behind every policy."
        </p>
      </div>
    </div>
  );
}
