import { useState } from 'react';
import { Settings2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const input: React.CSSProperties = {
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

type TestState = 'idle' | 'loading' | 'success' | 'error';

export default function Settings() {
  const [form, setForm] = useState<AppSettings>(getSettings());
  const [saved, setSaved] = useState(false);
  const [testB2B, setTestB2B] = useState<TestState>('idle');
  const [testB2C, setTestB2C] = useState<TestState>('idle');

  function handleChange(key: keyof AppSettings, value: string | number) {
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
        body: JSON.stringify({
          webhookUrl: url,
          contact: { name: 'Test Contact', phone: '+15555550000' },
        }),
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
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Configure Dialora AI webhooks and calling defaults</p>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Dialora AI Webhooks</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Create your AI agents in the Dialora dashboard, then paste each agent's webhook URL below. Calls will be routed through a secure server-side proxy.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={label}>B2B Agent Webhook URL</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              style={input}
              type="url"
              placeholder="https://api.dialora.ai/webhooks/agents/..."
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

        <div>
          <label style={label}>B2C Agent Webhook URL</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              style={input}
              type="url"
              placeholder="https://api.dialora.ai/webhooks/agents/..."
              value={form.b2cWebhookUrl}
              onChange={e => handleChange('b2cWebhookUrl', e.target.value)}
            />
            <button
              onClick={() => testWebhook(form.b2cWebhookUrl, setTestB2C)}
              disabled={!form.b2cWebhookUrl || testB2C === 'loading'}
              style={{ whiteSpace: 'nowrap', padding: '0 16px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <TestIcon state={testB2C} />
              Test
            </button>
          </div>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Calling Defaults</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={label}>Default Timezone</label>
            <select
              style={{ ...input, cursor: 'pointer' }}
              value={form.defaultTimezone}
              onChange={e => handleChange('defaultTimezone', e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} style={{ background: '#0d0d14' }}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={label}>Delay Between Calls (seconds)</label>
            <input
              style={input}
              type="number"
              min={1}
              max={60}
              value={form.delayBetweenCalls}
              onChange={e => handleChange('delayBetweenCalls', parseInt(e.target.value) || 5)}
            />
          </div>
        </div>
      </div>

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
    </div>
  );
}
