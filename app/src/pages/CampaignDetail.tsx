import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, UserPlus, Play, Pause, Square,
  RotateCcw, CheckCircle2, XCircle, Clock, PhoneCall,
  Ban, Trash2, Building2, User, ChevronDown, ChevronUp,
  FileText, Headphones, Timer,
} from 'lucide-react';
import { getCampaignById, saveCampaign } from '../data/store';
import type { Campaign, Contact, LeadStatus, CallResult } from '../types';

const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'hot',           label: 'HOT',           color: '#ef4444' },
  { value: 'warm',          label: 'WARM',          color: '#f59e0b' },
  { value: 'cold',          label: 'COLD',          color: '#60a5fa' },
  { value: 'callback',      label: 'CALLBACK',      color: '#a78bfa' },
  { value: 'not_interested', label: 'NOT INT.',     color: '#475569' },
  { value: 'voicemail',     label: 'VOICEMAIL',     color: '#2dd4bf' },
];

type CallStatus = Contact['status'];

const STATUS_CONFIG: Record<CallStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: '#64748b', icon: <Clock size={13} /> },
  calling: { label: 'Calling…', color: '#f59e0b', icon: <PhoneCall size={13} /> },
  completed: { label: 'Done', color: '#10b981', icon: <CheckCircle2 size={13} /> },
  failed: { label: 'Failed', color: '#ef4444', icon: <XCircle size={13} /> },
  dnc: { label: 'DNC', color: '#8b5cf6', icon: <Ban size={13} /> },
};

function parseCsv(text: string): Partial<Contact>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/['"]/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return {
      name: obj.name || obj.full_name || '',
      phone: obj.phone || obj.phone_number || obj.mobile || '',
      email: obj.email || obj.email_address || '',
      company: obj.company || obj.company_name || obj.organization || '',
      notes: obj.notes || obj.note || '',
      leadSource: obj.lead_source || obj.source || '',
    };
  }).filter(c => c.name && c.phone);
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#f1f5f9',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: 5,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function normalizeLeadStatus(raw?: string | null): LeadStatus | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase().replace(/[\s-]/g, '_');
  const map: Record<string, LeadStatus> = {
    hot: 'hot', warm: 'warm', cold: 'cold',
    not_interested: 'not_interested', callback: 'callback',
    voicemail: 'voicemail', unqualified: 'unqualified',
  };
  return map[lower];
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', company: '', notes: '' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const campaignRef = useRef<Campaign | null>(null);
  campaignRef.current = campaign;

  useEffect(() => {
    if (id) {
      const c = getCampaignById(id);
      if (c) setCampaign(c);
    }
  }, [id]);

  // Poll for call results when contacts are in 'calling' state
  useEffect(() => {
    const interval = setInterval(async () => {
      const current = campaignRef.current;
      if (!current) return;

      const callingContacts = current.contacts.filter(c => c.status === 'calling');
      if (callingContacts.length === 0) return;

      const lookupIds = callingContacts.flatMap(c => [c.id, c.phone.replace(/\D/g, '')]).filter(Boolean);

      try {
        const resp = await fetch(`/api/get-results?ids=${lookupIds.join(',')}`);
        if (!resp.ok) return;
        const results: CallResult[] = await resp.json();
        if (!results.length) return;

        const resultMap = new Map<string, CallResult>();
        for (const r of results) {
          if (r.contactId) resultMap.set(r.contactId, r);
          if (r.phone) resultMap.set(r.phone.replace(/\D/g, ''), r);
        }

        setCampaign(prev => {
          if (!prev) return prev;
          let changed = false;
          const contacts = prev.contacts.map(c => {
            if (c.status !== 'calling') return c;
            const result = resultMap.get(c.id) || resultMap.get(c.phone.replace(/\D/g, ''));
            if (!result) return c;
            changed = true;
            return {
              ...c,
              status: 'completed' as CallStatus,
              leadStatus: normalizeLeadStatus(result.leadStatus as string) || c.leadStatus,
              transcript: result.transcript ?? c.transcript,
              recordingUrl: result.recordingUrl ?? c.recordingUrl,
              callDuration: result.duration ?? c.callDuration,
              calledAt: c.calledAt || result.receivedAt,
            };
          });
          if (!changed) return prev;
          const allResolved = contacts.every(c => c.status !== 'pending' && c.status !== 'calling');
          const updated = { ...prev, contacts, status: allResolved ? 'completed' : prev.status };
          saveCampaign(updated);
          return updated;
        });
      } catch {
        // silent polling failure
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const persist = useCallback((updated: Campaign) => {
    saveCampaign(updated);
    setCampaign({ ...updated });
  }, []);

  function addContact() {
    if (!campaign || !newContact.name.trim() || !newContact.phone.trim()) return;
    const contact: Contact = {
      id: crypto.randomUUID(),
      ...newContact,
      status: 'pending',
    };
    persist({ ...campaign, contacts: [...campaign.contacts, contact] });
    setNewContact({ name: '', phone: '', email: '', company: '', notes: '' });
    setShowAddForm(false);
  }

  function removeContact(contactId: string) {
    if (!campaign) return;
    persist({ ...campaign, contacts: campaign.contacts.filter(c => c.id !== contactId) });
  }

  function retryContact(contactId: string) {
    if (!campaign) return;
    const contacts = campaign.contacts.map(c =>
      c.id === contactId ? { ...c, status: 'pending' as CallStatus, error: undefined } : c
    );
    persist({ ...campaign, contacts });
  }

  function setLeadStatus(contactId: string, leadStatus: LeadStatus) {
    if (!campaign) return;
    const contacts = campaign.contacts.map(c =>
      c.id === contactId ? { ...c, leadStatus } : c
    );
    persist({ ...campaign, contacts });
  }

  function markDNC(contactId: string) {
    if (!campaign) return;
    const contacts = campaign.contacts.map(c =>
      c.id === contactId ? { ...c, status: 'dnc' as CallStatus } : c
    );
    persist({ ...campaign, contacts });
  }

  function handleCsvDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadCsv(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadCsv(file);
    e.target.value = '';
  }

  function loadCsv(file: File) {
    if (!campaign) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseCsv(ev.target?.result as string);
      const newContacts: Contact[] = parsed.map(p => ({
        id: crypto.randomUUID(),
        name: p.name ?? '',
        phone: p.phone ?? '',
        email: p.email,
        company: p.company,
        notes: p.notes,
        leadSource: p.leadSource,
        status: 'pending',
      }));
      persist({ ...campaign, contacts: [...campaign.contacts, ...newContacts] });
    };
    reader.readAsText(file);
  }

  async function launchCampaign() {
    if (!campaign) return;
    abortRef.current = false;
    const toCall = campaign.contacts.filter(c => c.status === 'pending');
    if (toCall.length === 0) return;

    persist({ ...campaign, status: 'running' });

    for (let i = 0; i < toCall.length; i++) {
      if (abortRef.current) break;
      const contact = toCall[i];

      setCampaign(prev => {
        if (!prev) return prev;
        const contacts = prev.contacts.map(c => c.id === contact.id ? { ...c, status: 'calling' as CallStatus } : c);
        return { ...prev, contacts };
      });

      try {
        const webhookUrl = campaign.webhookUrl;
        if (!webhookUrl) throw new Error('No webhook URL configured');

        const resp = await fetch('/api/trigger-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl,
            contact: {
              name: contact.name,
              phone: contact.phone,
              email: contact.email ?? '',
              company: contact.company ?? '',
              notes: contact.notes ?? '',
              lead_source: contact.leadSource ?? '',
              contactId: contact.id,
              campaignId: campaign.id,
              custom_field_1: contact.id,
              custom_field_2: campaign.id,
            },
          }),
        });

        const newStatus: CallStatus = resp.ok ? 'calling' : 'failed';
        const error = resp.ok ? undefined : `HTTP ${resp.status}`;

        setCampaign(prev => {
          if (!prev) return prev;
          const contacts = prev.contacts.map(c =>
            c.id === contact.id ? { ...c, status: newStatus, error, calledAt: new Date().toISOString() } : c
          );
          const updated = { ...prev, contacts, callsSent: (prev.callsSent ?? 0) + 1 };
          saveCampaign(updated);
          return updated;
        });
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'Network error';
        setCampaign(prev => {
          if (!prev) return prev;
          const contacts = prev.contacts.map(c =>
            c.id === contact.id ? { ...c, status: 'failed' as CallStatus, error } : c
          );
          const updated = { ...prev, contacts };
          saveCampaign(updated);
          return updated;
        });
      }

      if (i < toCall.length - 1 && !abortRef.current) {
        await new Promise(r => setTimeout(r, campaign.delayBetweenCalls * 1000));
      }
    }

    setCampaign(prev => {
      if (!prev) return prev;
      const hasCalling = prev.contacts.some(c => c.status === 'calling');
      const allResolved = prev.contacts.every(c => c.status !== 'pending' && c.status !== 'calling');
      const nextStatus: Campaign['status'] = abortRef.current
        ? 'paused'
        : allResolved
          ? 'completed'
          : hasCalling
            ? 'running'
            : 'paused';
      const updated = { ...prev, status: nextStatus };
      saveCampaign(updated);
      return updated;
    });
  }

  function pauseCampaign() {
    abortRef.current = true;
  }

  function resetCampaign() {
    if (!campaign) return;
    abortRef.current = true;
    const contacts = campaign.contacts.map(c => ({ ...c, status: 'pending' as CallStatus, error: undefined, calledAt: undefined }));
    persist({ ...campaign, contacts, status: 'draft', callsSent: 0 });
  }

  if (!campaign) {
    return (
      <div style={{ padding: '32px 40px', color: '#64748b' }}>
        Campaign not found.{' '}
        <span style={{ color: '#60a5fa', cursor: 'pointer' }} onClick={() => navigate('/campaigns')}>Go back</span>
      </div>
    );
  }

  const total = campaign.contacts.length;
  const completed = campaign.contacts.filter(c => c.status === 'completed').length;
  const failed = campaign.contacts.filter(c => c.status === 'failed').length;
  const pending = campaign.contacts.filter(c => c.status === 'pending').length;
  const calling = campaign.contacts.filter(c => c.status === 'calling').length;
  const pct = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0;
  const isRunning = campaign.status === 'running';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
      <button
        onClick={() => navigate('/campaigns')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}
      >
        <ArrowLeft size={14} /> Back to Campaigns
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: campaign.type === 'b2b' ? 'rgba(59,130,246,0.15)' : 'rgba(20,184,166,0.15)', border: `1px solid ${campaign.type === 'b2b' ? 'rgba(59,130,246,0.3)' : 'rgba(20,184,166,0.3)'}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {campaign.type === 'b2b' ? <Building2 size={20} color="#60a5fa" /> : <User size={20} color="#2dd4bf" />}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>{campaign.name}</h1>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{campaign.type.toUpperCase()} • {campaign.timezone} • {campaign.delayBetweenCalls}s delay</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isRunning && pending > 0 && (
            <button onClick={launchCampaign} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Play size={14} fill="#fff" /> Launch ({pending} pending)
            </button>
          )}
          {isRunning && (
            <button onClick={pauseCampaign} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#fbbf24', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Pause size={14} /> Pause
            </button>
          )}
          <button onClick={resetCampaign} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
            <Square size={14} /> Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', value: total, color: '#94a3b8' },
          { label: 'Completed', value: completed, color: '#10b981' },
          { label: 'Failed', value: failed, color: '#ef4444' },
          { label: 'Pending', value: pending + calling, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #14b8a6)', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleCsvDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ flex: 1, border: `2px dashed ${isDragOver ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: isDragOver ? 'rgba(59,130,246,0.05)' : 'transparent', transition: 'all 0.15s' }}
        >
          <Upload size={18} color="#64748b" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Import CSV</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Drop file or click • columns: name, phone, email, company, notes</div>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={handleFileInput} />

        <button
          onClick={() => setShowAddForm(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <UserPlus size={15} /> Add Contact
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input style={inputStyle} placeholder="Jane Smith" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input style={inputStyle} placeholder="+1 555 000 0000" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} placeholder="jane@company.com" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle} placeholder="Acme Corp" value={newContact.company} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Notes</label>
              <input style={inputStyle} placeholder="Any context for the AI agent..." value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addContact} disabled={!newContact.name || !newContact.phone} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: newContact.name && newContact.phone ? 1 : 0.5 }}>Add</button>
            <button onClick={() => setShowAddForm(false)} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {campaign.contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
          <PhoneCall size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 14, margin: 0 }}>No contacts yet. Import a CSV or add manually.</p>
        </div>
      ) : (
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name', 'Phone', 'Company', 'Status', 'Lead', 'Time', ''].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaign.contacts.map((contact, i) => {
                const cfg = STATUS_CONFIG[contact.status];
                const isExpanded = expandedId === contact.id;
                const hasDetails = !!(contact.transcript || contact.recordingUrl || contact.callDuration);
                return (
                  <Fragment key={contact.id}>
                    <tr style={{ borderBottom: isExpanded ? 'none' : i < campaign.contacts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: contact.status === 'calling' ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
                        {contact.name}
                        {contact.error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>{contact.error}</div>}
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{contact.phone}</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#64748b' }}>{contact.company || '—'}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: `${cfg.color}18`, color: cfg.color }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        {contact.status === 'completed' || contact.leadStatus ? (
                          <select
                            value={contact.leadStatus ?? ''}
                            onChange={e => setLeadStatus(contact.id, e.target.value as LeadStatus)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: LEAD_STATUS_OPTIONS.find(o => o.value === contact.leadStatus)?.color ?? '#64748b', cursor: 'pointer', outline: 'none' }}
                          >
                            <option value="" style={{ background: '#0d0d14', color: '#64748b' }}>— Qualify —</option>
                            {LEAD_STATUS_OPTIONS.map(o => (
                              <option key={o.value} value={o.value} style={{ background: '#0d0d14', color: o.color }}>{o.label}</option>
                            ))}
                          </select>
                        ) : <span style={{ color: '#334155', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: '#475569' }}>
                        {contact.calledAt ? (
                          <div>
                            <div>{new Date(contact.calledAt).toLocaleTimeString()}</div>
                            {contact.callDuration != null && (
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                                {Math.floor(contact.callDuration / 60)}:{String(contact.callDuration % 60).padStart(2, '0')}
                              </div>
                            )}
                          </div>
                        ) : contact.status === 'calling' ? (
                          <span style={{ color: '#f59e0b', fontSize: 11 }}>In progress...</span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {hasDetails && (
                            <button onClick={() => setExpandedId(isExpanded ? null : contact.id)} title={isExpanded ? 'Collapse' : 'View Details'} style={{ width: 28, height: 28, background: isExpanded ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', border: `1px solid ${isExpanded ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)'}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#60a5fa' }}>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          )}
                          {contact.status === 'failed' && (
                            <button onClick={() => retryContact(contact.id)} title="Retry" style={{ width: 28, height: 28, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fbbf24' }}>
                              <RotateCcw size={12} />
                            </button>
                          )}
                          {contact.status !== 'dnc' && (
                            <button onClick={() => markDNC(contact.id)} title="Mark DNC" style={{ width: 28, height: 28, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#a78bfa' }}>
                              <Ban size={12} />
                            </button>
                          )}
                          <button onClick={() => removeContact(contact.id)} title="Remove" style={{ width: 28, height: 28, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0, borderBottom: i < campaign.contacts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <div style={{ padding: '14px 20px', background: 'rgba(59,130,246,0.02)', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: contact.recordingUrl ? '1fr 1fr' : '1fr', gap: 16 }}>
                              {contact.transcript && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <FileText size={13} color="#60a5fa" />
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Transcript</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, maxHeight: 200, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                                    {contact.transcript}
                                  </div>
                                </div>
                              )}
                              {contact.recordingUrl && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <Headphones size={13} color="#a78bfa" />
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recording</span>
                                  </div>
                                  <audio controls src={contact.recordingUrl} style={{ width: '100%', height: 36 }} />
                                </div>
                              )}
                            </div>
                            {!contact.transcript && !contact.recordingUrl && contact.callDuration != null && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                                <Timer size={13} />
                                <span>Call duration: {Math.floor(contact.callDuration / 60)}:{String(contact.callDuration % 60).padStart(2, '0')}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
