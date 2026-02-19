import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronDown, Mic, Mail } from 'lucide-react';
import ScriptVar from '../components/ScriptVar';

const productHooks = [
  {
    signal: 'Family history of cancer / heart issues',
    icon: '🎗️',
    color: '#ec4899',
    script: 'Combined\'s Cancer Insurance pays cash from day one of a cancer diagnosis — the average first-year cost after diagnosis is over $42,000 and health insurance doesn\'t cover the income you lose, the travel, or the everyday bills. This puts cash in your hands immediately.',
  },
  {
    signal: 'High deductible / HDHP plan',
    icon: '🏥',
    color: '#3b82f6',
    script: 'If you\'re on a high-deductible plan, you\'re carrying a lot of exposure before insurance kicks in. Our accident and hospital policies pay benefits directly to you — so your deductible doesn\'t become a debt.',
  },
  {
    signal: 'Self-employed / freelancer',
    icon: '💼',
    color: '#f59e0b',
    script: 'As someone who works for yourself, there\'s no sick pay, no employer safety net. Our disability income protection pays you a monthly benefit if you can\'t work due to illness or injury — so you can focus on recovering, not on how the bills get paid.',
  },
  {
    signal: 'Has dependents / family',
    icon: '👨‍👩‍👧',
    color: '#14b8a6',
    script: 'Our life and critical illness policies are designed for families — a lump sum paid directly to you if you\'re diagnosed with a covered illness, up to $50,000. That\'s not for the hospital. That\'s for your mortgage, your kids\' school, your life.',
  },
  {
    signal: 'General / unknown situation',
    icon: '💡',
    color: '#94a3b8',
    script: 'Think of it this way: your health insurance covers the medical side. Combined Insurance covers everything health insurance doesn\'t — the rent, the groceries, the income you lose when you can\'t show up to work.',
  },
];

const stages = [
  {
    number: 1,
    title: 'Warm Opening',
    duration: '15s',
    color: '#3b82f6',
    script: `Hi, is this {{first_name}}? Great — {{first_name}}, this is Alex calling from Combined Insurance. I have just about 60 seconds — I'm reaching out to folks in {{state}} because a lot of people have health insurance and still end up with real financial exposure when something unexpected happens. Does that sound familiar at all?`,
    tip: 'Warm, conversational tone. If they hesitate, continue — most people recognize the pain point.',
  },
  {
    number: 2,
    title: 'Gap Awareness',
    duration: '30s',
    color: '#8b5cf6',
    script: `Here's the issue most people don't realize until it's too late: standard health insurance covers a portion of the bill — but it doesn't replace lost income, it doesn't pay for the days you miss work, and it doesn't help with rent or groceries while you're recovering. That financial gap is exactly what supplemental insurance is designed to close — and it pays cash directly to you, not to a hospital.`,
    tip: 'Let this land. Don\'t rush. The gap awareness creates urgency that makes the product hook more powerful.',
  },
  {
    number: 3,
    title: 'Product Hook',
    duration: '45s',
    color: '#14b8a6',
    script: '',
    tip: 'Pick ONE hook based on what you learn about the prospect. Click the scenario that matches their situation.',
    isProductHook: true,
  },
  {
    number: 4,
    title: 'Qualify',
    duration: '30s',
    color: '#f59e0b',
    script: `Just so I can point you in the right direction — do you currently have any supplemental coverage? Things like accident insurance, disability income protection, or a cancer policy?`,
    branches: [
      { label: 'YES — They have some coverage', action: 'Then you already know the value — I\'d love to make sure you\'re getting the right coverage level and not leaving gaps.', color: '#10b981' },
      { label: 'NO — No supplemental coverage', action: 'Then there\'s a real opportunity here. People who have health insurance and no supplemental coverage are the most financially exposed — Combined is specifically designed for that situation.', color: '#3b82f6' },
    ],
  },
  {
    number: 5,
    title: 'Close for Quote',
    duration: '30s',
    color: '#10b981',
    script: `What I'd like to do is connect you with one of our licensed specialists for a no-obligation quote — it takes about 15 minutes and you'll walk away knowing exactly what coverage would look like and what it would cost. Is {{day}} or {{day}} better for a quick call?`,
    leadActions: [
      { label: '🔥 HOT', color: '#ef4444', action: 'Book exact date & time — transfer live if possible' },
      { label: '🌡️ WARM', color: '#f59e0b', action: 'Book specific date/time, send overview' },
      { label: '❄️ COLD', color: '#60a5fa', action: 'Capture email, add to nurture sequence' },
      { label: '🚫 DNC', color: '#94a3b8', action: 'Log immediately, remove from list, do not re-contact' },
    ],
  },
];

const voicemail = `Hi {{first_name}}, this is Alex from Combined Insurance. I'm calling because a lot of people in {{state}} with standard health coverage have real financial exposure when something unexpected happens — and don't know it. If you'd like to know where your gaps are, give us a call at {{callback_number}} or I'll try you again. Have a great day.`;

export default function B2CScript() {
  const [activeStage, setActiveStage] = useState(0);
  const [showVoicemail, setShowVoicemail] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [selectedHook, setSelectedHook] = useState<number | null>(null);
  const stage = stages[activeStage];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '3px 10px', background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>B2C Campaign</div>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Individuals & Families</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Goal: qualify interest and book a quote call with a licensed agent.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
        {stages.map((s, i) => (
          <div key={s.number} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setActiveStage(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < activeStage ? '#10b981' : i === activeStage ? s.color : 'rgba(255,255,255,0.06)', border: `2px solid ${i <= activeStage ? (i < activeStage ? '#10b981' : s.color) : 'rgba(255,255,255,0.12)'}`, transition: 'all 0.2s', fontSize: 13, fontWeight: 700, color: i <= activeStage ? '#fff' : '#64748b' }}>
                {i < activeStage ? <CheckCircle size={16} /> : s.number}
              </div>
              <span style={{ fontSize: 10, color: i === activeStage ? '#f8fafc' : '#64748b', fontWeight: i === activeStage ? 600 : 400, whiteSpace: 'nowrap', maxWidth: 70, textAlign: 'center', lineHeight: 1.3 }}>
                {s.title.split(' ').slice(0, 2).join(' ')}
              </span>
            </button>
            {i < stages.length - 1 && (
              <div style={{ width: 40, height: 2, background: i < activeStage ? '#10b981' : 'rgba(255,255,255,0.08)', margin: '0 2px', marginBottom: 24, flexShrink: 0, transition: 'all 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '28px', marginBottom: 20, borderTop: `3px solid ${stage.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Stage {stage.number} of 5</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{stage.title}</h2>
          </div>
          <div style={{ padding: '4px 12px', background: `${stage.color}18`, border: `1px solid ${stage.color}40`, borderRadius: 20, fontSize: 13, fontWeight: 600, color: stage.color }}>~{stage.duration}</div>
        </div>

        {'isProductHook' in stage && stage.isProductHook ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select Prospect Scenario</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {productHooks.map((hook, i) => (
                <button key={i} onClick={() => setSelectedHook(selectedHook === i ? null : i)} style={{ background: selectedHook === i ? `${hook.color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${selectedHook === i ? hook.color + '50' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <span style={{ fontSize: 18 }}>{hook.icon}</span>
                  <span style={{ fontSize: 13, color: selectedHook === i ? hook.color : '#94a3b8', fontWeight: 500 }}>{hook.signal}</span>
                </button>
              ))}
            </div>
            {selectedHook !== null && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${productHooks[selectedHook].color}30`, borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Mic size={14} color={productHooks[selectedHook].color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: productHooks[selectedHook].color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alex Says</span>
                </div>
                <div style={{ fontSize: 15, color: '#e2e8f0', lineHeight: 1.8 }}>{productHooks[selectedHook].script}</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Mic size={14} color={stage.color} />
              <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alex Says</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px', marginBottom: 16, fontSize: 15, color: '#e2e8f0', lineHeight: 1.8 }}>
              <ScriptVar text={stage.script} />
            </div>
          </>
        )}

        {stage.tip && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 'branches' in stage ? 20 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>💡 TIP</div>
            <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>{stage.tip}</div>
          </div>
        )}

        {'branches' in stage && stage.branches && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Response Branches</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stage.branches.map((branch, i) => (
                <div key={i}>
                  <button onClick={() => setExpandedBranch(expandedBranch === i ? null : i)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: `1px solid ${branch.color}30`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', color: branch.color, fontSize: 13, fontWeight: 600 }}>
                    <span>{branch.label}</span>
                    <ChevronDown size={14} style={{ transform: expandedBranch === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {expandedBranch === i && (
                    <div style={{ background: `${branch.color}06`, border: `1px solid ${branch.color}20`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px 14px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>{branch.action}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {'leadActions' in stage && stage.leadActions && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Lead Temperature → Next Action</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {stage.leadActions.map((action) => (
                <div key={action.label} style={{ background: `${action.color}08`, border: `1px solid ${action.color}25`, borderRadius: 8, padding: '12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: action.color, marginBottom: 4 }}>{action.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{action.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: activeStage === 0 ? '#334155' : '#94a3b8', cursor: activeStage === 0 ? 'default' : 'pointer', fontSize: 14, fontWeight: 500 }}>
          ← Previous
        </button>
        <span style={{ fontSize: 12, color: '#475569' }}>{activeStage + 1} / {stages.length}</span>
        <button onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))} disabled={activeStage === stages.length - 1} style={{ padding: '10px 20px', background: activeStage < stages.length - 1 ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, color: activeStage < stages.length - 1 ? '#fff' : '#334155', cursor: activeStage < stages.length - 1 ? 'pointer' : 'default', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          Next Stage <ChevronRight size={14} />
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <button onClick={() => setShowVoicemail(!showVoicemail)} style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={14} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>B2C Voicemail Script (20s max)</span>
          </div>
          <ChevronDown size={14} style={{ transform: showVoicemail ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showVoicemail && (
          <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '16px', marginTop: 12, fontSize: 14, color: '#e2e8f0', lineHeight: 1.8 }}>
              <ScriptVar text={voicemail} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
