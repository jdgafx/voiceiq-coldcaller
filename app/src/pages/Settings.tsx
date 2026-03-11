import { useState } from 'react';
import { Settings2, CheckCircle2, AlertCircle, Loader2, Mail, Calendar } from 'lucide-react';
import { getSettings, saveSettings } from '../data/store';
import type { AppSettings } from '../types';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
];

const card: React.CSSProperties = {
  background: '#0d0d14',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  padding: 24,
  marginBottom: 20,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#f1f5f9',
  outline: 'none',
  boxSizing: 'border-box',
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#475569',
  marginTop: 4,
  lineHeight: 1.4,
};

type TestState = 'idle' | 'loading' | 'success' | 'error';

export default function Settings() {
  const [form, setForm] = useState<AppSettings>(getSettings());
  const [saved, setSaved] = useState(false);
  const [testB2B, setTestB2B] = useState<TestState>('idle');

  function handleChange(key: keyof AppSettings, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function testWebhook(url: string, setter: (s: TestState) => void) {
    if (!url) return;
    setter('loading');
    try {
      const resp = await fetch('/api/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: url, testOnly: true }),
      });
      setter(resp.ok ? 'success' : 'error');
    } catch {
      setter('error');
    }
    setTimeout(() => setter('idle'), 3000);
  }

  function TestIcon({ state }: { state: TestState }) {
    if (state === 'loading') return <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />;
    if (state === 'success') return <CheckCircle2 size={14} color="#10b981" />;
    if (state === 'error') return <AlertCircle size={14} color="#ef4444" />;
    return null;
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings2 size={20} color="#a78bfa" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Settings</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Configure webhooks, notifications, and calendar integration</p>
        </div>
      </div>

      {/* ─── EMAIL & CALENDAR (top priority — most visible) ──────────────── */}
      <div style={{ ...card, borderColor: 'rgba(59,130,246,0.15)', borderWidth: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Mail size={18} color="#60a5fa" />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Email & Calendar</h2>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Set where call notifications are sent and whose calendar receives meeting invites. These can be different people/addresses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={12} /> Notification Email
              </span>
            </label>
            <input
              style={inputStyle}
              type="email"
              placeholder="who@gets-notified.com"
              value={form.notificationEmail}
              onChange={e => handleChange('notificationEmail', e.target.value)}
            />
            <p style={hintStyle}>Receives call completion notifications, lead alerts, and failed call reports from Dialora.</p>
          </div>

          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> Calendar / Invite Email
              </span>
            </label>
            <input
              style={inputStyle}
              type="email"
              placeholder="who@gets-calendar-invites.com"
              value={form.calendarEmail}
              onChange={e => handleChange('calendarEmail', e.target.value)}
            />
            <p style={hintStyle}>Google Calendar events and Google Meet links are created for this account. Meeting invites come from this address.</p>
          </div>
        </div>

        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 6 }}>HOW IT WORKS</div>
          <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
            When the AI agent books a meeting with a prospect, a Google Calendar event with a Google Meet video link is automatically created on the Calendar Email's account. The prospect receives an invite. The Notification Email gets a summary.
          </div>
        </div>
      </div>

      {/* ─── WEBHOOK ────────────────────────────────────────────────────── */}
      <div style={card}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Dialora AI Webhook</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Your Dialora agent's webhook trigger URL. Calls are routed through a secure server-side proxy.
        </p>

        <div>
          <label style={labelStyle}>B2B Agent Webhook URL</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              style={inputStyle}
              type="url"
              placeholder="https://api.portal.vocaliq.io/webhooks/agents/..."
              value={form.b2bWebhookUrl}
              onChange={e => handleChange('b2bWebhookUrl', e.target.value)}
            />
            <button
              onClick={() => testWebhook(form.b2bWebhookUrl, setTestB2B)}
              disabled={!form.b2bWebhookUrl || testB2B === 'loading'}
              style={{ whiteSpace: 'nowrap', padding: '0 16px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <TestIcon state={testB2B} />
              Test
            </button>
          </div>
        </div>
      </div>

      {/* ─── ZAPIER AUTOMATION ──────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Zapier Automation</h2>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          When a call completes, VoiceIQ forwards the lead data to Zapier which creates a Google Calendar event with Meet link and sends an email notification.
        </p>

        <div>
          <label style={labelStyle}>Zapier Webhook URL</label>
          <input
            style={inputStyle}
            type="url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={form.zapierWebhookUrl || ''}
            onChange={e => handleChange('zapierWebhookUrl', e.target.value)}
          />
          <p style={hintStyle}>From Zapier: Webhooks by Zapier → Catch Hook trigger. Handles calendar events, Meet links, and email notifications.</p>
        </div>

        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '12px 16px', marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>ZAPIER ZAP FLOW</div>
          <div style={{ fontSize: 12, color: '#fbbf24', lineHeight: 1.6 }}>
            Catch Hook → Google Calendar (Create Detailed Event + Meet) → Gmail (Send lead notification email)
          </div>
        </div>
      </div>

      {/* ─── CALLING DEFAULTS ───────────────────────────────────────────── */}
      <div style={card}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Calling Defaults</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>Default Timezone</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.defaultTimezone}
              onChange={e => handleChange('defaultTimezone', e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} style={{ background: '#0d0d14' }}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Delay Between Calls (seconds)</label>
            <input
              style={inputStyle}
              type="number"
              min={1}
              max={60}
              value={form.delayBetweenCalls}
              onChange={e => handleChange('delayBetweenCalls', parseInt(e.target.value) || 5)}
            />
          </div>
        </div>
      </div>

      {/* ─── SAVE ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Save Settings
        </button>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 13 }}>
            <CheckCircle2 size={14} />
            Saved
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
