import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  TrendingUp,
  Bot,
  Zap,
  Flame,
  PhoneCall,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getCampaigns, getSettings } from '../data/store';
import { marketStats } from '../data/playbook';
import { motion, AnimatePresence } from 'framer-motion';

const LEAD_COLORS: Record<string, string> = {
  hot: '#ef4444',
  warm: '#f59e0b',
  cold: '#60a5fa',
  callback: '#a78bfa',
  not_interested: '#475569',
  voicemail: '#2dd4bf',
};

function getRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  const campaigns = getCampaigns();
  const settings = getSettings();

  const totalCampaigns = campaigns.length;
  const runningCount = campaigns.filter(c => c.status === 'running').length;
  const totalCallsMade = campaigns.reduce((sum, c) => sum + (c.callsSent ?? 0), 0);

  const allContacts = campaigns.flatMap(c => c.contacts);
  const hotCount = allContacts.filter(ct => ct.leadStatus === 'hot').length;
  const warmCount = allContacts.filter(ct => ct.leadStatus === 'warm').length;
  const completedContacts = allContacts.filter(
    ct => ct.status === 'completed' || ct.status === 'failed',
  );
  const conversionRate =
    completedContacts.length > 0
      ? ((hotCount + warmCount) / completedContacts.length * 100).toFixed(1)
      : '0.0';

  const recentCalls = campaigns
    .flatMap(c => c.contacts.filter(ct => !!ct.calledAt))
    .sort((a, b) => new Date(b.calledAt!).getTime() - new Date(a.calledAt!).getTime())
    .slice(0, 8);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }} className="fade-in-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}>
            Combined Insurance • A Chubb Company
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            VoiceIQ Cold Caller
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 4 }}>
          <button
            onClick={() => navigate('/campaigns')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px',
              background: 'linear-gradient(135deg, #3b82f6, #14b8a6)',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            New Campaign
          </button>
          <button
            onClick={() => navigate('/pipeline')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: '#94a3b8', cursor: 'pointer',
            }}
          >
            Open Pipeline
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div className="glass-card" style={{ padding: '20px 18px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Phone size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', marginBottom: 4, letterSpacing: '-1px' }}>{totalCampaigns}</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Total Campaigns</div>
          {runningCount > 0 && (
            <div style={{ fontSize: 11, color: '#3b82f6' }}>{runningCount} running now</div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '20px 18px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Zap size={18} color="#14b8a6" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', marginBottom: 4, letterSpacing: '-1px' }}>{totalCallsMade.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Calls Made</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 18px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Flame size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', marginBottom: 4, letterSpacing: '-1px' }}>{hotCount}</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Hot Leads</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 18px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <TrendingUp size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', marginBottom: 4, letterSpacing: '-1px' }}>{conversionRate}%</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Conversion Rate</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Bot size={16} color="#60a5fa" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Agent Status</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: settings.b2bWebhookUrl ? '#22c55e' : '#ef4444',
                boxShadow: settings.b2bWebhookUrl ? '0 0 8px #22c55e88' : '0 0 8px #ef444488',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
                  B2B Agent
                  {settings.b2bWebhookUrl
                    ? <CheckCircle2 size={12} color="#22c55e" />
                    : <AlertCircle size={12} color="#ef4444" />
                  }
                </div>
                <div style={{ fontSize: 11, color: settings.b2bWebhookUrl ? '#22c55e' : '#ef4444', marginTop: 2 }}>
                  {settings.b2bWebhookUrl ? 'Connected' : 'Not configured'}
                </div>
              </div>
            </div>
            {!settings.b2bWebhookUrl && (
              <button
                onClick={() => navigate('/agent-setup')}
                style={{ fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Set up →
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: settings.b2cWebhookUrl ? '#22c55e' : '#ef4444',
                boxShadow: settings.b2cWebhookUrl ? '0 0 8px #22c55e88' : '0 0 8px #ef444488',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
                  B2C Agent
                  {settings.b2cWebhookUrl
                    ? <CheckCircle2 size={12} color="#22c55e" />
                    : <AlertCircle size={12} color="#ef4444" />
                  }
                </div>
                <div style={{ fontSize: 11, color: settings.b2cWebhookUrl ? '#22c55e' : '#ef4444', marginTop: 2 }}>
                  {settings.b2cWebhookUrl ? 'Connected' : 'Not configured'}
                </div>
              </div>
            </div>
            {!settings.b2cWebhookUrl && (
              <button
                onClick={() => navigate('/agent-setup')}
                style={{ fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Set up →
              </button>
            )}
          </div>
        </div>

        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <PhoneCall size={16} color="#60a5fa" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Recent Calls</span>
          </div>

          {recentCalls.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 12 }}>
              <PhoneCall size={32} color="#1e293b" />
              <p style={{ margin: 0, fontSize: 13, color: '#475569', textAlign: 'center' }}>
                No calls yet — launch a campaign to see activity here
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentCalls.map(ct => (
                <div
                  key={ct.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{ct.name}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{ct.company ?? ct.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {ct.leadStatus && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: '2px 7px', borderRadius: 4,
                        background: `${LEAD_COLORS[ct.leadStatus] ?? '#475569'}1a`,
                        color: LEAD_COLORS[ct.leadStatus] ?? '#475569',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {ct.leadStatus.replace('_', ' ')}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: '#475569', minWidth: 58, textAlign: 'right' }}>
                      {getRelativeTime(ct.calledAt!)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <button
          onClick={() => setIntelligenceOpen(prev => !prev)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="#3b82f6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Market Intelligence</span>
          </div>
          {intelligenceOpen
            ? <ChevronUp size={16} color="#64748b" />
            : <ChevronDown size={16} color="#64748b" />
          }
        </button>

        <AnimatePresence initial={false}>
          {intelligenceOpen && (
            <motion.div
              key="intelligence-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  {marketStats.map(stat => (
                    <div key={stat.value} className="glass-card" style={{ padding: '18px 16px' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa', marginBottom: 6, letterSpacing: '-1px' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 8 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 10, color: '#475569' }}>{stat.source}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Chubb Credibility Statement
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "Combined Insurance is backed by Chubb — the world's largest publicly traded property and
                    casualty insurance company, operating in 54 countries with an A+ Superior rating from AM Best.
                    When you choose Combined, you're choosing global financial strength behind every policy."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
