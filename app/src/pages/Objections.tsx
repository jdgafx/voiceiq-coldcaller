import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { b2bObjections, b2cObjections } from '../data/playbook';
import ScriptVar from '../components/ScriptVar';

type Filter = 'all' | 'b2b' | 'b2c';

export default function Objections() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const allObjections = [
    ...b2bObjections.map(o => ({ ...o, type: 'b2b' as const })),
    ...b2cObjections.map(o => ({ ...o, type: 'b2c' as const })),
  ];

  const filtered = allObjections.filter(o => {
    const matchesFilter = filter === 'all' || o.type === filter;
    const matchesSearch = search === '' || o.question.toLowerCase().includes(search.toLowerCase()) || o.answer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpanded = (key: string) => setExpanded(expanded === key ? null : key);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Objection Handler</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>One thoughtful reframe after each objection. If they say no again, respect it and move on.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search objections..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px 10px 36px', fontSize: 14, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
          {(['all', 'b2b', 'b2c'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: '10px 16px', background: filter === f ? 'rgba(59,130,246,0.2)' : 'none', border: 'none', color: filter === f ? '#60a5fa' : '#64748b', fontSize: 13, fontWeight: filter === f ? 600 : 400, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {f === 'all' ? 'All' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No objections match your search.</div>
        )}
        {filtered.map((obj, i) => {
          const key = `${obj.type}-${i}`;
          const isOpen = expanded === key;
          const accentColor = obj.type === 'b2b' ? '#3b82f6' : '#14b8a6';
          return (
            <div key={key} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <button
                onClick={() => toggleExpanded(key)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div style={{ padding: '2px 8px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: 6, fontSize: 10, fontWeight: 700, color: accentColor, textTransform: 'uppercase', flexShrink: 0 }}>
                    {obj.type}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{obj.question}</span>
                </div>
                <ChevronDown size={14} color="#475569" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>
              {isOpen && (
                <div style={{ borderTop: `2px solid ${accentColor}40`, background: `${accentColor}06`, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alex Responds:</div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8 }}>
                    <ScriptVar text={obj.answer} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>THE GOLDEN RULE</div>
        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
          The goal is never to pressure — it's to inform. One thoughtful reframe after an objection. If they say no again, respect it, log it, and move on.
        </p>
      </div>
    </div>
  );
}
