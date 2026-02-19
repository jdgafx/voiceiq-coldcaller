import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronDown, Mic, Mail } from 'lucide-react';
import ScriptVar from '../components/ScriptVar';

const stages = [
  {
    number: 1,
    title: 'Pattern Interrupt Opening',
    duration: '15s',
    color: '#3b82f6',
    script: `Hi, is this {{first_name}}?\n\n[Wait for confirmation]\n\n{{first_name}}, my name is Alex — I'm calling from Combined Insurance, a Chubb company. I'll be quick — I'm reaching out to HR leaders in {{city_or_state}} because most benefits packages we see are quietly costing good employees — not in dollars, but in protection gaps they don't find out about until it's too late. Does that sound like something worth 90 seconds of your time?`,
    tip: 'Speak at 0.9x normal pace, warm tone. PAUSE after asking — let them respond. If they say "yes" or "go ahead," proceed to Stage 2. If they push back, go to the Objection Handler.',
  },
  {
    number: 2,
    title: 'Establish the HR Pain Point',
    duration: '30s',
    color: '#8b5cf6',
    script: `Here's what I hear from HR teams constantly right now: health insurance premiums keep going up, deductibles are higher than ever, and employees are technically covered — but they're still getting hit with thousands of dollars of out-of-pocket costs when something actually happens. Is that something you're seeing with your team?`,
    tip: 'If YES: Move to Stage 3 immediately.\nIf NO / "We have good benefits": Use Agree & Redirect — "That\'s great to hear — most companies we work with do have solid health coverage. What Combined does is layer on top of that — it adds a cash safety net that pays employees directly, so your health plan never leaves them exposed. And the best part? It costs you zero."',
    branches: [
      { label: 'YES — Pain confirmed', action: 'Move to Stage 3 immediately', color: '#10b981' },
      { label: 'NO — "We have good benefits"', action: 'Agree & Redirect: "That\'s great to hear — most companies we work with do have solid health coverage. What Combined does is layer on top of that — it adds a cash safety net that pays employees directly, so your health plan never leaves them exposed. And the best part? It costs you zero."', color: '#f59e0b' },
    ],
  },
  {
    number: 3,
    title: 'The Value Bridge',
    duration: '60s',
    color: '#14b8a6',
    script: `Combined Insurance — backed by Chubb — specializes in supplemental coverage: accident, critical illness, cancer, disability, hospital, and life insurance. Here's why HR managers love adding this: it costs your company nothing. Zero. These are employee-funded benefits through payroll deduction — but they show up in your total compensation package, they boost retention, and they compete with the big-company benefit offerings that are pulling your talent away.\n\nWe have a 100-year track record, an A+ rating from AM Best, and our account executives handle the entire enrollment education process with your employees — so it literally comes off your plate. All the upside of a better benefits package, none of the admin work.`,
    tip: 'Drop in this stat: "77% of employees say inadequate benefits would make them look for another job. Supplemental coverage is one of the fastest ways to close that gap at zero cost to you."',
    stat: '77% of employees say inadequate benefits would make them look for another job.',
  },
  {
    number: 4,
    title: 'Qualify & Pivot',
    duration: '30s',
    color: '#f59e0b',
    script: `Quick question, {{first_name}} — do you currently offer any voluntary supplemental benefits as part of your package? Things like accident coverage, critical illness, or disability income protection?`,
    branches: [
      { label: '"No, we don\'t offer that"', action: 'Perfect — you have a real opportunity to add meaningful value to your benefits package at absolutely no cost to the company. Let me set you up with a 20-minute benefits review with our licensed specialist...', color: '#10b981' },
      { label: '"Yes, we have Aflac"', action: 'Excellent — a lot of companies start with Aflac. What I\'d love to show you is how Combined\'s Chubb-backed products compare on coverage depth, financial strength ratings, and what our dedicated enrollment support actually looks like. Would a quick comparison review be worth 20 minutes of your time?', color: '#3b82f6' },
      { label: '"We already have a broker handling benefits"', action: 'That\'s great — we work through brokers too, and we complement what they do. Could I ask: does your current voluntary line cover income replacement if someone can\'t work? If there\'s a gap, it may be worth 20 minutes to find out.', color: '#8b5cf6' },
      { label: '"I\'m not the right person"', action: 'No problem at all — who handles your benefits enrollment decisions? I\'d love to get them the right information.', color: '#94a3b8' },
    ],
  },
  {
    number: 5,
    title: 'Close for the Meeting',
    duration: '30s',
    color: '#10b981',
    script: `I'd love to set you up with a 20-minute benefits consultation with one of our licensed specialists — no sales pressure, just a look at where your current benefits package has gaps and what adding voluntary supplemental coverage would look like for your team. What does your calendar look like {{this_week_or_next_week}}?`,
    leadActions: [
      { label: '🔥 HOT', color: '#ef4444', action: 'Transfer live or book within 24 hrs' },
      { label: '🌡️ WARM', color: '#f59e0b', action: 'Confirm specific day and time' },
      { label: '❄️ COLD', color: '#60a5fa', action: 'Get email — send benefits overview' },
      { label: '🚫 NOT INTERESTED', color: '#94a3b8', action: '"I completely understand — is it okay if I send you our benefits comparison sheet? No obligation, just for your files."' },
    ],
  },
];

const voicemail = `Hi {{first_name}}, this is Alex calling from Combined Insurance, a Chubb company. I'm reaching out to HR leaders in {{state}} about a way to add significant value to your benefits package — at zero cost to your company. I'll send you a quick overview to your email. If you'd like to connect, you can reach us at {{callback_number}}. Have a great {{day_of_week}}.`;

export default function B2BScript() {
  const [activeStage, setActiveStage] = useState(0);
  const [showVoicemail, setShowVoicemail] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);

  const stage = stages[activeStage];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px' }} className="fade-in-up">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '3px 10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#60a5fa' }}>B2B Campaign</div>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>HR Managers & Business Owners</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Goal: book a benefits consultation or enrollment meeting. Alex never quotes premiums.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
        {stages.map((s, i) => (
          <div key={s.number} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setActiveStage(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < activeStage ? '#10b981' : i === activeStage ? s.color : 'rgba(255,255,255,0.06)',
                border: `2px solid ${i <= activeStage ? (i < activeStage ? '#10b981' : s.color) : 'rgba(255,255,255,0.12)'}`,
                transition: 'all 0.2s',
                fontSize: 13, fontWeight: 700, color: i <= activeStage ? '#fff' : '#64748b',
              }}>
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
            <div style={{ fontSize: 12, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Stage {stage.number} of 5
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{stage.title}</h2>
          </div>
          <div style={{ padding: '4px 12px', background: `${stage.color}18`, border: `1px solid ${stage.color}40`, borderRadius: 20, fontSize: 13, fontWeight: 600, color: stage.color }}>
            ~{stage.duration}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Mic size={14} color={stage.color} />
          <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alex Says</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px', marginBottom: 20, fontSize: 15, color: '#e2e8f0', lineHeight: 1.8 }}>
          {stage.script.split('\n\n').map((para, i) => (
            <p key={i} style={{ margin: i > 0 ? '12px 0 0' : 0 }}>
              <ScriptVar text={para} />
            </p>
          ))}
        </div>

        {'stat' in stage && stage.stat && (
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <span style={{ fontSize: 13, color: '#93c5fd', fontWeight: 500 }}><ScriptVar text={stage.stat} /></span>
          </div>
        )}

        {stage.tip && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 'branches' in stage && stage.branches ? 20 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>💡 TIP</div>
            <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{stage.tip}</div>
          </div>
        )}

        {'branches' in stage && stage.branches && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Response Branches</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stage.branches.map((branch, i) => (
                <div key={i}>
                  <button
                    onClick={() => setExpandedBranch(expandedBranch === i ? null : i)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: `1px solid ${branch.color}30`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', color: branch.color, fontSize: 13, fontWeight: 600 }}
                  >
                    <span><ScriptVar text={branch.label} /></span>
                    <ChevronDown size={14} style={{ transform: expandedBranch === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {expandedBranch === i && (
                    <div style={{ background: `${branch.color}06`, border: `1px solid ${branch.color}20`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px 14px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>
                      <ScriptVar text={branch.action} />
                    </div>
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
        <button
          onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
          disabled={activeStage === 0}
          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: activeStage === 0 ? '#334155' : '#94a3b8', cursor: activeStage === 0 ? 'default' : 'pointer', fontSize: 14, fontWeight: 500 }}
        >
          ← Previous
        </button>
        <span style={{ fontSize: 12, color: '#475569' }}>{activeStage + 1} / {stages.length}</span>
        <button
          onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
          disabled={activeStage === stages.length - 1}
          style={{ padding: '10px 20px', background: activeStage < stages.length - 1 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, color: activeStage < stages.length - 1 ? '#fff' : '#334155', cursor: activeStage < stages.length - 1 ? 'pointer' : 'default', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          Next Stage <ChevronRight size={14} />
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <button
          onClick={() => setShowVoicemail(!showVoicemail)}
          style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={14} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>B2B Voicemail Script (25s max)</span>
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
