import { useState, useEffect, useCallback } from 'react';
import { Flame, Thermometer, Snowflake, Calendar, XCircle, PhoneCall, HelpCircle, Play, ChevronDown, ChevronUp, RefreshCw, TrendingUp } from 'lucide-react';
import { getCampaigns, saveCampaign } from '../data/store';
import type { Contact, LeadStatus, CallResult } from '../types';

const COLUMNS: { status: LeadStatus | 'unqualified'; label: string; color: string; bg: string; Icon: React.ElementType }[] = [
  { status: 'hot',           label: 'HOT',          color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   Icon: Flame },
  { status: 'warm',          label: 'WARM',         color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  Icon: Thermometer },
  { status: 'cold',          label: 'COLD',         color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  Icon: Snowflake },
  { status: 'callback',      label: 'CALLBACK',     color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', Icon: Calendar },
  { status: 'not_interested', label: 'NOT INTERESTED', color: '#475569', bg: 'rgba(71,85,105,0.08)', Icon: XCircle },
  { status: 'voicemail',     label: 'VOICEMAIL',    color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)', Icon: PhoneCall },
  { status: 'unqualified',   label: 'UNCATEGORIZED', color: '#64748b', bg: 'rgba(100,116,139,0.08)', Icon: HelpCircle },
];

interface EnrichedContact extends Contact {
  campaignId: string;
  campaignName: string;
  campaignType: 'b2b' | 'b2c';
}

function allContacts(): EnrichedContact[] {
  const campaigns = getCampaigns();
  return campaigns.flatMap(c =>
    c.contacts
      .filter(contact => contact.status === 'completed' || contact.status === 'failed' || contact.leadStatus)
      .map(contact => ({
        ...contact,
        campaignId: c.id,
        campaignName: c.name,
        campaignType: c.type,
        leadStatus: contact.leadStatus ?? 'unqualified',
      }))
  );
}

function updateContactLeadStatus(campaignId: string, contactId: string, leadStatus: LeadStatus, extra?: Partial<Contact>) {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) return;
    const contacts = campaign.contacts.map(c =>
    c.id === contactId ? { ...c, leadStatus, ...(extra ?? {}) } : c
  );
  saveCampaign({ ...campaign, contacts });
}

function ContactCard({ contact, onStatusChange }: { contact: EnrichedContact; onStatusChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [moving, setMoving] = useState(false);

  function moveTo(status: LeadStatus) {
    setMoving(true);
    updateContactLeadStatus(contact.campaignId, contact.id, status);
    setTimeout(() => { setMoving(false); onStatusChange(); }, 200);
  }

  const cfg = COLUMNS.find(c => c.status === (contact.leadStatus ?? 'unqualified'))!;

  return (
    <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14, marginBottom: 8, opacity: moving ? 0.4 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.name}</div>
          {contact.company && <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.company}</div>}
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: contact.campaignType === 'b2b' ? 'rgba(59,130,246,0.15)' : 'rgba(20,184,166,0.15)', color: contact.campaignType === 'b2b' ? '#60a5fa' : '#2dd4bf', flexShrink: 0, marginLeft: 6, textTransform: 'uppercase' }}>
          {contact.campaignType}
        </span>
      </div>

      <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 8 }}>{contact.phone}</div>

      {contact.calledAt && (
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
          {new Date(contact.calledAt).toLocaleDateString()} {new Date(contact.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {contact.callDuration && <span style={{ marginLeft: 6 }}>· {Math.round(contact.callDuration / 60)}m {contact.callDuration % 60}s</span>}
        </div>
      )}

      <div style={{ fontSize: 10, color: '#475569', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.campaignName}</div>

      {(contact.recordingUrl || contact.transcript) && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, marginBottom: 8 }}>
          {contact.recordingUrl && (
            <a href={contact.recordingUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 5, textDecoration: 'none', marginBottom: 6 }}>
              <Play size={10} fill="#10b981" /> Play Recording
            </a>
          )}
          {contact.transcript && (
            <button onClick={() => setExpanded(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              Transcript
            </button>
          )}
          {expanded && contact.transcript && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 10px', lineHeight: 1.6, maxHeight: 150, overflowY: 'auto' }}>
              {contact.transcript}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {COLUMNS.filter(c => c.status !== cfg.status && c.status !== 'unqualified').slice(0, 4).map(col => (
          <button key={col.status} onClick={() => moveTo(col.status as LeadStatus)}
            style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4, background: `${col.color}14`, border: `1px solid ${col.color}25`, color: col.color, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {col.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function fetchServerResults(contacts: EnrichedContact[], onDone: (results: CallResult[]) => void) {
  const ids = contacts.map(c => c.id).join(',');
  if (!ids) return;
  fetch(`/api/get-results?ids=${ids}`)
    .then(r => r.ok ? r.json() : [])
    .then(results => onDone(results as CallResult[]))
    .catch(() => onDone([]));
}

export default function Pipeline() {
  const [contacts, setContacts] = useState<EnrichedContact[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  function reload() {
    setContacts(allContacts());
  }

  const syncServerResults = useCallback(() => {
    setSyncing(true);
    const all = allContacts();
    fetchServerResults(all, (results) => {
      results.forEach(r => {
        if (!r.contactId) return;
        updateContactLeadStatus(r.campaignId, r.contactId, (r.leadStatus as LeadStatus) ?? 'unqualified', {
          recordingUrl: r.recordingUrl ?? undefined,
          transcript: r.transcript ?? undefined,
          callDuration: r.duration ?? undefined,
        });
      });
      setContacts(allContacts());
      setLastSync(new Date());
      setSyncing(false);
    });
  }, []);

  useEffect(() => {
    reload();
    syncServerResults();
  }, [syncServerResults]);

  const grouped = COLUMNS.reduce<Record<string, EnrichedContact[]>>((acc, col) => {
    acc[col.status] = contacts.filter(c => (c.leadStatus ?? 'unqualified') === col.status);
    return acc;
  }, {});

  const total = contacts.length;
  const hot = grouped['hot']?.length ?? 0;
  const warm = grouped['warm']?.length ?? 0;
  const convRate = total > 0 ? Math.round(((hot + warm) / total) * 100) : 0;

  return (
    <div style={{ padding: '32px 32px 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="#f87171" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Lead Pipeline</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              {total} calls · {hot + warm} qualified · {convRate}% conversion
              {lastSync && <span style={{ marginLeft: 8 }}>· synced {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </p>
          </div>
        </div>
        <button onClick={syncServerResults} disabled={syncing}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
          <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          Sync Results
        </button>
      </div>

      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <TrendingUp size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#64748b', margin: '0 0 8px' }}>No calls yet</p>
          <p style={{ fontSize: 13, margin: 0 }}>Launch a campaign and call results will appear here automatically</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 16, minHeight: 400 }}>
          {COLUMNS.map(col => {
            const cards = grouped[col.status] ?? [];
            const ColIcon = col.Icon;
            return (
              <div key={col.status} style={{ minWidth: 230, maxWidth: 230, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', background: col.bg, border: `1px solid ${col.color}25`, borderRadius: '10px 10px 0 0', marginBottom: 0 }}>
                  <ColIcon size={13} color={col.color} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: col.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: col.color, background: `${col.color}20`, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cards.length}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: 8, minHeight: 80 }}>
                  {cards.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 11, color: '#334155' }}>Empty</div>
                  ) : (
                    cards.map(contact => (
                      <ContactCard key={contact.id} contact={contact} onStatusChange={reload} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
