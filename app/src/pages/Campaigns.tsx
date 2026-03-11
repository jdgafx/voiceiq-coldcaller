import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Plus, Building2, Trash2, Play, ChevronRight } from 'lucide-react';
import { getCampaigns, saveCampaign, deleteCampaign } from '../data/store';
import { getSettings } from '../data/store';
import type { Campaign } from '../types';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
];

function statusColor(status: Campaign['status']) {
  if (status === 'running') return '#10b981';
  if (status === 'completed') return '#3b82f6';
  if (status === 'paused') return '#f59e0b';
  return '#64748b';
}

function statusLabel(status: Campaign['status']) {
  if (status === 'running') return 'Running';
  if (status === 'completed') return 'Completed';
  if (status === 'paused') return 'Paused';
  return 'Draft';
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>(getCampaigns);
  const [showModal, setShowModal] = useState(false);
  const settings = getSettings();

  const [form, setForm] = useState({
    name: '',
    type: 'b2b' as const,
    webhookUrl: '',
    timezone: settings.defaultTimezone || 'America/New_York',
    delayBetweenCalls: settings.delayBetweenCalls || 5,
  });

  function createCampaign() {
    if (!form.name.trim()) return;
    const webhook = form.webhookUrl || settings.b2bWebhookUrl;
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      type: form.type,
      webhookUrl: webhook,
      contacts: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      timezone: form.timezone,
      delayBetweenCalls: form.delayBetweenCalls,
      callsSent: 0,
    };
    saveCampaign(campaign);
    setCampaigns(getCampaigns());
    setShowModal(false);
    setForm({ name: '', type: 'b2b', webhookUrl: '', timezone: settings.defaultTimezone || 'America/New_York', delayBetweenCalls: settings.delayBetweenCalls || 5 });
    navigate(`/campaigns/${campaign.id}`);
  }

  function removeCampaign(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteCampaign(id);
    setCampaigns(getCampaigns());
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#f1f5f9',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={20} color="#60a5fa" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Campaigns</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', maxWidth: 440, margin: '0 auto' }}>
          <Phone size={44} style={{ opacity: 0.15, marginBottom: 16 }} />
          <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>Create your first campaign</p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
            Upload a contact list and the AI agent calls each person automatically.
          </p>
          <div style={{ textAlign: 'left', display: 'inline-flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#60a5fa', flexShrink: 0 }}>1</div>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Click <strong style={{ color: '#e2e8f0' }}>New Campaign</strong> above</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#60a5fa', flexShrink: 0 }}>2</div>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Upload or paste your contacts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#60a5fa', flexShrink: 0 }}>3</div>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Hit <strong style={{ color: '#e2e8f0' }}>Start Calling</strong> — the AI handles the rest</span>
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6, #14b8a6)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              New Campaign
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {campaigns.map(c => {
            const done = c.contacts.filter(x => x.status === 'completed').length;
            const total = c.contacts.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/campaigns/${c.id}`)}
                style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 22px', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', alignItems: 'center', gap: 16 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={18} color="#60a5fa" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${statusColor(c.status)}20`, color: statusColor(c.status), textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>{statusLabel(c.status)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', textTransform: 'uppercase', flexShrink: 0 }}>B2B</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#64748b' }}>
                    <span>{total} contacts</span>
                    <span>{done} completed</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {total > 0 && (
                    <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #14b8a6)', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {c.status === 'running' && <Play size={14} color="#10b981" />}
                  <button
                    onClick={e => removeCampaign(c.id, e)}
                    style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <ChevronRight size={16} color="#475569" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, width: 480, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>New Campaign</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Campaign Name</label>
              <input style={inputStyle} type="text" placeholder="e.g. Q1 B2B Outreach" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Type</label>
              <div style={{ padding: '12px', borderRadius: 8, border: '2px solid #3b82f6', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} />
                B2B — HR Directors, Benefits Managers, Business Owners
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Webhook URL (leave blank to use Settings default)</label>
              <input style={inputStyle} type="url" placeholder={`https://api.dialora.ai/webhooks/agents/...`} value={form.webhookUrl} onChange={e => setForm(p => ({ ...p, webhookUrl: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Timezone</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz} style={{ background: '#0d0d14' }}>{tz.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Delay (seconds)</label>
                <input style={inputStyle} type="number" min={1} max={60} value={form.delayBetweenCalls} onChange={e => setForm(p => ({ ...p, delayBetweenCalls: parseInt(e.target.value) || 5 }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
              <button onClick={createCampaign} disabled={!form.name.trim()} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: form.name.trim() ? 1 : 0.5 }}>Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
