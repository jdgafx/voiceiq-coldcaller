import { useNavigate } from 'react-router-dom';
import { Building2, User, TrendingUp, Shield, Globe, DollarSign, ArrowRight, Star } from 'lucide-react';
import { marketStats } from '../data/playbook';

const quickStats = [
  { icon: Star, label: 'AM Best Rating', value: 'A+ Superior', color: '#f59e0b' },
  { icon: Shield, label: 'Years of Service', value: '100+', color: '#3b82f6' },
  { icon: Globe, label: 'Countries via Chubb', value: '54', color: '#14b8a6' },
  { icon: DollarSign, label: 'Max Critical Illness Payout', value: '$50,000', color: '#10b981' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Combined Insurance • A Chubb Company
          </div>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#f8fafc', margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          AI Cold Call <span className="gradient-text">Playbook</span>
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
          Supplemental Insurance • Employer & Individual Campaigns<br />
          Powered by Chubb • A+ AM Best • 100+ Years of Service
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickStats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: '20px 18px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => navigate('/b2b')}
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="#60a5fa" />
            </div>
            <ArrowRight size={16} color="#60a5fa" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>B2B Campaign</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>HR Managers & Business Owners</div>
          <div style={{ fontSize: 12, color: '#60a5fa' }}>5-Stage Call Flow • Qualify to Meeting</div>
        </button>

        <button
          onClick={() => navigate('/b2c')}
          style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 12, padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(20,184,166,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#14b8a6" />
            </div>
            <ArrowRight size={16} color="#14b8a6" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>B2C Campaign</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Individuals & Families</div>
          <div style={{ fontSize: 12, color: '#14b8a6' }}>5-Stage Call Flow • Qualify to Quote</div>
        </button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TrendingUp size={16} color="#3b82f6" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Market Intelligence</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {marketStats.map((stat) => (
            <div key={stat.value} className="glass-card" style={{ padding: '18px 16px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa', marginBottom: 6, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{stat.source}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderLeft: '3px solid #3b82f6' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Chubb Credibility Statement
        </div>
        <p style={{ margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, fontStyle: 'italic' }}>
          "Combined Insurance is backed by Chubb — the world's largest publicly traded property and casualty insurance company, operating in 54 countries with an A+ Superior rating from AM Best. When you choose Combined, you're choosing global financial strength behind every policy."
        </p>
      </div>
    </div>
  );
}
