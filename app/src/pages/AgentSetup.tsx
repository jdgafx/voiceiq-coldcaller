import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Building2, User, Copy, CheckCheck, ChevronRight,
  ArrowLeft, ArrowRight, Mic, Settings2, Zap, ExternalLink,
  Loader2, CheckCircle2, AlertCircle, Clipboard,
} from 'lucide-react';
import { getSettings, saveSettings } from '../data/store';

const B2B_SYSTEM_PROMPT = `You are Alex, a professional outbound calling agent for Combined Insurance, a Chubb company. You are calling HR directors, benefits managers, and business owners about supplemental employee benefits.

PERSONALITY: Professional, empathetic, confident, conversational. Never pushy. Never robotic. Sound like a trusted colleague, not a telemarketer. Speak at a measured, natural pace. Use brief pauses after asking questions to let the prospect respond fully before continuing.

YOUR PRIMARY GOAL: Schedule a 20-minute appointment with a licensed Combined Insurance specialist. If the prospect is very interested, offer an immediate live transfer.

---

OPENING:
"Hi, this is Alex calling from Combined Insurance, a Chubb company. Am I speaking with [decision maker name]?"

[If confirmed] "I'll be brief — do you have 2 minutes? I'm reaching out to HR and benefits managers about something that costs your company nothing and could genuinely help your employees."

---

VALUE PROPOSITION:
"We add supplemental coverage — accident, critical illness, cancer, disability — that sits on top of whatever benefits you already have. Employees choose it, they pay for it through payroll deduction, and it fills the financial gaps your health plan doesn't. Zero employer cost. Zero admin burden on your team."

KEY STATS (share if prospect shows interest):
- 77% of employees would consider leaving a job due to inadequate benefits
- 80% of employers say supplemental insurance helps with employee retention
- Average first-year cost after a cancer diagnosis exceeds $42,000
- Combined Insurance: 100+ years in business, A+ AM Best rating, backed by Chubb — world's largest publicly traded P&C insurer

---

OBJECTION HANDLING:

"We already have benefits through [carrier]":
"Absolutely — most companies we work with do. What Combined layers on top is supplemental protection that your health plan doesn't touch: cash directly to employees for accidents, critical illness, cancer, or disability income. It doesn't replace what you have — it fills the gaps. And it costs your company nothing. Worth a 20-minute look?"

"We can't take on more admin complexity":
"I completely understand — benefits admin is already a full-time job. Here's the thing: Combined's account executives manage the entire employee education and enrollment process. We sit down with your employees, explain the options, and handle the paperwork. Your HR team's involvement is minimal. The employees who choose coverage pay through payroll deduction. That's it."

"Our employees can't afford more deductions":
"That's a real concern and it's worth addressing directly. The average Combined supplemental policy runs a few dollars a week — often less than a daily coffee. But more importantly: the employees who can least afford extra deductions are often the ones most financially exposed when they miss two weeks of work with a broken arm or a cancer diagnosis."

"Not interested":
"No problem at all. Is it okay if I send you a one-page overview for your records? No obligation — if it's useful during your next open enrollment review, great. If not, nothing lost."

"Send me something in writing":
"Absolutely — I'll get that out today. Just so I can make sure it's relevant: what's your current headcount, and do you do an annual open enrollment period? That way I can make sure what we send actually applies to your situation."

---

CLOSE:
"I'd love to get one of our specialists connected with you for a quick 20-minute call. They can walk through exactly what this would look like for your team. Are you free this week — would [day] or [day] work better?"

If HOT: "Let me connect you with our specialist right now — one moment."

---

LEAD QUALIFICATION — classify every call with one of these outcomes and include it in your response:
- HOT: Agreed to connect with specialist now or within 24 hours
- WARM: Interested, needs a specific time scheduled
- COLD: Mild interest, not ready to commit
- NOT_INTERESTED: Clear, firm rejection
- CALLBACK: Good prospect, bad timing — booked a specific date/time
- VOICEMAIL: No answer, left voicemail

---

COMPLIANCE (NON-NEGOTIABLE):
- Always identify yourself as an automated calling system if sincerely asked — never claim to be human
- Never quote specific premium prices — only licensed agents can do this
- Never accept payment or bind coverage during a call
- Honor all Do Not Call requests immediately — confirm removal and end call
- Only call between 8:00 AM and 9:00 PM in the prospect's local time zone
- Maximum 2 retry attempts per contact
- Always state a callback number in voicemails`;

const B2C_SYSTEM_PROMPT = `You are Alex, a professional outbound calling agent for Combined Insurance, a Chubb company. You are calling individual consumers about supplemental insurance protection for themselves and their families.

PERSONALITY: Warm, empathetic, conversational, trustworthy. Build rapport quickly. Never pushy. Sound like a knowledgeable friend explaining an important financial protection — not a salesperson. Speak at a natural, human pace. Pause after questions to give the prospect space to think and respond.

YOUR PRIMARY GOAL: Get the prospect to agree to a 15-minute call with a licensed Combined Insurance specialist. If very interested, offer an immediate live transfer.

---

OPENING:
"Hi, may I speak with [prospect name]? This is Alex from Combined Insurance, a Chubb company."

[If speaking with them] "I'm reaching out because we help people protect their income and savings when something unexpected happens — an accident, a serious illness, something that puts you out of work. Do you have just 2 minutes?"

---

VALUE PROPOSITION:
"Here's something most people don't realize until they're in it: your health insurance pays the hospital and the doctor. But it doesn't replace your income when you can't work. It doesn't cover rent when you're recovering. Combined Insurance pays cash directly to you — on top of whatever your health plan already covers — for accidents, cancer, critical illness, hospital stays, and disability. It closes the financial gap that health insurance leaves open."

PRODUCT HOOKS (adapt based on conversation):
- Accident protection: "If you slip and land in the ER, your health plan covers some of it — you cover the rest. This pays you cash for that gap."
- Cancer protection: "One in three Americans will face a cancer diagnosis. This policy pays cash from day one — treatments, travel, lost income, whatever you need it for."
- Income protection: "Your biggest financial asset is your ability to earn a paycheck. This protects it if you can't work."
- Hospital protection: "High-deductible health plans leave people with thousands in out-of-pocket costs when hospitalized. This pays cash for every day you're admitted."
- Critical illness: "The average first-year cost after a cancer diagnosis is over $42,000. A lump sum up to $50,000 paid directly to you means finances are the last thing you worry about."

---

OBJECTION HANDLING:

"I already have health insurance":
"That's great — health insurance is essential. But here's the gap most people don't realize until they're in it: health insurance pays the hospital and the doctor. It doesn't replace your income if you can't work. It doesn't cover the rent when you're recovering. Combined Insurance pays cash directly to you for exactly those situations — on top of whatever your health plan already covers."

"I can't afford more insurance":
"That's fair — and I won't pretend it's nothing. But let me ask: if you missed four weeks of work tomorrow because of an accident or illness, what would that cost you? For most people, that math is a lot scarier than a few dollars a week in premiums. Our specialist can walk you through actual numbers — no obligation to buy anything — and you can decide if it makes sense."

"I'm healthy — I don't need it":
"That's actually when it's the best time to get it — when you're healthy, coverage is less expensive and easier to qualify for. The point isn't that something will definitely happen. It's that if it does, you're not making financial decisions during the worst moment of your life. One in three Americans faces a cancer diagnosis. The ones who planned ahead are the ones who get to focus on recovery instead of bills."

"How did you get my number?":
"Your information was provided through our opt-in outreach program. If you'd prefer not to be contacted, I'll remove you from our list right now — absolutely no problem. Is that what you'd like, or would you be open to a quick overview of what we offer?"

"I need to talk to my spouse / partner first":
"Of course — that makes complete sense. Would it be useful if I scheduled a 15-minute call with both of you? That way you can both hear the information at the same time and decide together. What works for your schedules this week?"

---

CLOSE:
"I'd love to connect you with one of our specialists for a quick 15-minute conversation — no pressure, no obligation. They can answer your specific questions and walk you through actual numbers for your situation. Are you free this week?"

If HOT: "Let me connect you with our specialist right now — one moment."

---

LEAD QUALIFICATION — classify every call with one of these outcomes:
- HOT: Agreed to connect with specialist now or within 24 hours
- WARM: Interested, needs a specific time scheduled
- COLD: Mild interest, not ready to commit
- NOT_INTERESTED: Clear, firm rejection
- CALLBACK: Good prospect, bad timing — booked a specific date/time
- VOICEMAIL: No answer, left voicemail

---

COMPLIANCE (NON-NEGOTIABLE):
- Always identify yourself as an automated calling system if sincerely asked — never claim to be human
- Never quote specific premium prices — only licensed agents can do this
- Never accept payment or bind coverage during a call
- Honor all Do Not Call requests immediately — confirm removal and end call
- Only call between 8:00 AM and 9:00 PM in the prospect's local time zone
- Maximum 2 retry attempts per contact
- Always state a callback number in voicemails`;

const VOICE_SETTINGS = [
  { label: 'Agent Name', value: 'Alex', note: 'Warm, gender-neutral name. Used in all self-introductions.' },
  { label: 'Voice', value: 'Phoebe', note: 'Warm, professional female voice. Most natural-sounding for insurance sales — builds trust instantly.' },
  { label: 'Language', value: 'English (US)', note: 'American English. Match the prospect\'s locale.' },
  { label: 'Speaking Rate', value: '0.95', note: '5% slower than default. Builds trust, gives prospects time to process without feeling sluggish.' },
  { label: 'Silence Timeout', value: '2.8 seconds', note: 'Pause duration before the agent continues. Gives cold call prospects time to think without awkward silence.' },
  { label: 'Interruption Sensitivity', value: '0.3', note: 'Low. Never cut off the prospect. Let them finish even if they pause mid-sentence.' },
  { label: 'Max Call Duration', value: '300 seconds', note: '5 minutes. Cold calls must be concise — close quickly to schedule a specialist follow-up.' },
  { label: 'LLM Temperature', value: '0.7', note: 'Balanced. Consistent enough for professional calls, varied enough to sound human.' },
  { label: 'Top-P', value: '0.9', note: 'Nucleus sampling. Keeps responses focused while allowing natural variation.' },
  { label: 'Max Tokens', value: '250', note: 'Keeps agent responses concise. Cold calls need short, punchy replies — not essays.' },
  { label: 'Voicemail Detection', value: 'Enabled', note: 'Leave the voicemail script after 4 rings. Maximum 2 voicemails per contact.' },
  { label: 'End Call on Silence', value: '8 seconds', note: 'Hang up after 8s of dead air. Prevents billing on dropped connections.' },
  { label: 'Background Noise', value: 'Disabled', note: 'No office sounds. Clean audio is more credible for insurance calls.' },
  { label: 'First Message Delay', value: '0.5 seconds', note: 'Brief pause after connection before speaking. Feels natural, avoids sounding like a robocall.' },
];

const WEBHOOK_CONFIG = [
  { label: 'Trigger Endpoint (your app)', value: 'POST https://voiceiq-coldcaller.netlify.app/api/trigger-call', note: 'Your VoiceIQ app sends calls via this proxy. No direct browser-to-Dialora needed.' },
  { label: 'Call Result Callback (set in Dialora)', value: 'POST https://voiceiq-coldcaller.netlify.app/api/call-result', note: 'Set this as your Dialora result webhook URL so transcripts and recordings auto-sync back to the pipeline.' },
  { label: 'Required Callback Fields (Dialora → your app)', value: 'contactId, campaignId, phone, status, duration, recording_url, transcript, lead_status', note: 'Map these in your Dialora agent\'s result webhook config. The app uses contactId to match results to contacts.' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, color: copied ? '#10b981' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
    >
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────

const STEP_LABELS = ['Type', 'Script', 'Voice', 'Connect'];

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const isCompleted = num < step;
        const isActive = num === step;
        const borderColor = isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#334155';
        const textColor = isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#475569';
        const lineColor = num < step ? '#3b82f6' : 'rgba(255,255,255,0.08)';

        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <motion.div
                layoutId={`step-circle-${num}`}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: isCompleted ? '#10b981' : isActive ? 'rgba(59,130,246,0.2)' : '#0d0d14',
                  border: `2px solid ${borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: isCompleted ? '#fff' : textColor,
                  transition: 'all 0.3s ease',
                }}
              >
                {isCompleted ? <CheckCheck size={14} /> : num}
              </motion.div>
              <span style={{ fontSize: 11, fontWeight: 600, color: textColor, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 8px', marginBottom: 18, background: lineColor, borderRadius: 2, transition: 'background 0.3s ease' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MOTION VARIANTS ──────────────────────────────────────────────────────────

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
};

// ─── STEP 1: CHOOSE TYPE ───────────────────────────────────────────────────────

function StepChooseType({
  agentType,
  setAgentType,
  onNext,
}: {
  agentType: 'b2b' | 'b2c' | null;
  setAgentType: (t: 'b2b' | 'b2c') => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        What type of agent are you setting up?
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Choose the calling script that matches your target audience
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* B2B Card */}
        <button
          onClick={() => setAgentType('b2b')}
          style={{
            background: agentType === 'b2b' ? 'rgba(59,130,246,0.08)' : '#0d0d14',
            border: `2px solid ${agentType === 'b2b' ? '#3b82f6' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14, padding: 24, cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 11, background: agentType === 'b2b' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${agentType === 'b2b' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Building2 size={22} color={agentType === 'b2b' ? '#3b82f6' : '#64748b'} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: agentType === 'b2b' ? '#60a5fa' : '#e2e8f0', marginBottom: 6 }}>B2B Agent</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: 500 }}>HR Directors, Benefits Managers, Business Owners</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Schedule 20-minute specialist appointments. Professional, consultative tone.
          </div>
        </button>

        {/* B2C Card */}
        <button
          onClick={() => setAgentType('b2c')}
          style={{
            background: agentType === 'b2c' ? 'rgba(20,184,166,0.08)' : '#0d0d14',
            border: `2px solid ${agentType === 'b2c' ? '#14b8a6' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14, padding: 24, cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 11, background: agentType === 'b2c' ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${agentType === 'b2c' ? 'rgba(20,184,166,0.4)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <User size={22} color={agentType === 'b2c' ? '#14b8a6' : '#64748b'} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: agentType === 'b2c' ? '#2dd4bf' : '#e2e8f0', marginBottom: 6 }}>B2C Agent</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: 500 }}>Individual Consumers & Families</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Schedule 15-minute specialist calls. Warm, empathetic tone.
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onNext}
          disabled={agentType === null}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: agentType ? 'linear-gradient(135deg, #3b82f6, #14b8a6)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 10, color: agentType ? '#fff' : '#475569', fontSize: 14, fontWeight: 600, cursor: agentType ? 'pointer' : 'not-allowed', opacity: agentType ? 1 : 0.5, transition: 'all 0.2s ease' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 2: SCRIPT PREVIEW ────────────────────────────────────────────────────

function StepScriptPreview({
  agentType,
  onNext,
  onBack,
}: {
  agentType: 'b2b' | 'b2c';
  onNext: () => void;
  onBack: () => void;
}) {
  const prompt = agentType === 'b2b' ? B2B_SYSTEM_PROMPT : B2C_SYSTEM_PROMPT;
  const label = agentType === 'b2b' ? 'B2B' : 'B2C';

  const openingMatch = prompt.match(/OPENING:\n([\s\S]*?)(?=\n---)/);
  const valueMatch = prompt.match(/VALUE PROPOSITION:\n([\s\S]*?)(?=\n---)/);
  const closeMatch = prompt.match(/CLOSE:\n([\s\S]*?)(?=\n---)/);

  const openingText = openingMatch ? openingMatch[1].trim().split('\n').slice(0, 2).join(' ') : '';
  const valueText = valueMatch ? valueMatch[1].trim().split('\n').slice(0, 2).join(' ') : '';
  const closeText = closeMatch ? closeMatch[1].trim().split('\n').slice(0, 2).join(' ') : '';

  const chips = [
    { label: 'Opening', text: openingText, color: '#3b82f6' },
    { label: 'Value Prop', text: valueText, color: '#a78bfa' },
    { label: 'Close', text: closeText, color: '#10b981' },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Review Your {label} Agent's Script
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        This system prompt will be pasted into your Dialora agent. Alex will follow this script on every call.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <CopyButton text={prompt} />
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 20, maxHeight: 380, overflowY: 'auto', marginBottom: 20 }}>
        <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace' }}>
          {prompt}
        </pre>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
        {chips.map(chip => (
          <div
            key={chip.label}
            style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${chip.color}`, borderRadius: 8, padding: '10px 12px' }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: chip.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{chip.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {chip.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3: VOICE SETTINGS ────────────────────────────────────────────────────

function StepVoiceSettings({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const allSettingsText = 'VoiceIQ Agent Settings:\n' + VOICE_SETTINGS.map(s => `• ${s.label}: ${s.value}`).join('\n');

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Voice & Behavior Settings
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Apply these exact settings to your Dialora agent for optimal cold call performance
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Mic size={15} color="#a78bfa" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>14 Settings</span>
        <div style={{ flex: 1 }} />
        <CopyButton text={allSettingsText} />
      </div>

      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '26%' }}>Setting</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '28%' }}>Value</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Why</th>
            </tr>
          </thead>
          <tbody>
            {VOICE_SETTINGS.map((s, i) => (
              <tr key={s.label} style={{ borderBottom: i < VOICE_SETTINGS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{s.label}</td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#a78bfa', fontFamily: 'ui-monospace, monospace', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 4 }}>{s.value}</span>
                    <CopyButton text={s.value} />
                  </div>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 4: CONNECT ───────────────────────────────────────────────────────────

function StepConnect({
  agentType,
  webhookUrl,
  setWebhookUrl,
  onBack,
  onFinish,
  onSetupOther,
}: {
  agentType: 'b2b' | 'b2c';
  webhookUrl: string;
  setWebhookUrl: (v: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onSetupOther: () => void;
}) {
  const [testState, setTestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const callbackUrl = WEBHOOK_CONFIG[1].value.replace('POST ', '');
  const label = agentType === 'b2b' ? 'B2B' : 'B2C';
  const otherLabel = agentType === 'b2b' ? 'B2C' : 'B2B';

  async function handleTest() {
    if (!webhookUrl) return;
    setTestState('loading');
    try {
      const res = await fetch('/api/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, contact: { name: 'Test Contact', phone: '+15555550000' } }),
      });
      setTestState(res.ok ? 'success' : 'error');
    } catch {
      setTestState('error');
    }
  }

  function handleSave() {
    const settings = getSettings();
    if (agentType === 'b2b') {
      settings.b2bWebhookUrl = webhookUrl;
    } else {
      settings.b2cWebhookUrl = webhookUrl;
    }
    saveSettings(settings);
    setSaved(true);
  }

  if (saved) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={32} color="#10b981" />
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>Setup Complete!</h2>
        <p style={{ margin: '0 0 32px', fontSize: 14, color: '#64748b' }}>
          Your {label} agent is configured and ready to go.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onSetupOther}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            <Bot size={16} /> Set up {otherLabel} Agent
          </button>
          <button
            onClick={onFinish}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Go to Campaigns <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const setupSteps: Array<{ text: string; link: boolean; code?: string }> = [
    { text: 'Go to Dialora Dashboard → Create New Agent', link: true },
    { text: 'Paste the System Prompt from Step 2', link: false },
    { text: 'Apply Voice Settings from Step 3', link: false },
    { text: 'Set the callback URL to:', link: false, code: callbackUrl },
    { text: "Copy your agent's Webhook URL and paste it below", link: false },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Connect Your Agent
      </h2>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Create your agent in Dialora's dashboard, then paste the webhook URL here
      </p>

      {/* Numbered steps */}
      <div style={{ marginBottom: 28 }}>
        {setupSteps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>
                {i + 1}
              </div>
              {i < setupSteps.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', minHeight: 28 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < setupSteps.length - 1 ? 20 : 0, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {s.link ? (
                  <a href="https://www.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#60a5fa', lineHeight: 1.5, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {s.text} <ExternalLink size={13} />
                  </a>
                ) : (
                  <span style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{s.text}</span>
                )}
              </div>
              {s.code && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <code style={{ fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, padding: '4px 10px', wordBreak: 'break-all' }}>
                    {s.code}
                  </code>
                  <CopyButton text={s.code} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Webhook URL Input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
          {label} Agent Webhook URL
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Clipboard size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://api.dialora.ai/webhooks/agents/..."
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 34px', background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, fontFamily: 'ui-monospace, monospace', outline: 'none' }}
            />
          </div>
          <button
            onClick={handleTest}
            disabled={!webhookUrl || testState === 'loading'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', background: testState === 'success' ? 'rgba(16,185,129,0.15)' : testState === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${testState === 'success' ? 'rgba(16,185,129,0.3)' : testState === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: testState === 'success' ? '#10b981' : testState === 'error' ? '#f87171' : '#94a3b8', fontSize: 13, fontWeight: 600, cursor: !webhookUrl || testState === 'loading' ? 'not-allowed' : 'pointer', opacity: !webhookUrl ? 0.5 : 1, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {testState === 'loading' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {testState === 'success' && <CheckCircle2 size={14} />}
            {testState === 'error' && <AlertCircle size={14} />}
            {testState === 'idle' && <Zap size={14} />}
            {testState === 'loading' ? 'Testing...' : testState === 'success' ? 'Connected!' : testState === 'error' ? 'Failed' : 'Test'}
          </button>
        </div>
        {testState === 'error' && (
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#f87171' }}>
            Connection failed — check your webhook URL and try again.
          </p>
        )}
        {testState === 'success' && (
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#10b981' }}>
            Connection successful! Ready to save.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={!webhookUrl}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: webhookUrl ? 'linear-gradient(135deg, #3b82f6, #14b8a6)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 10, color: webhookUrl ? '#fff' : '#475569', fontSize: 14, fontWeight: 600, cursor: webhookUrl ? 'pointer' : 'not-allowed', opacity: webhookUrl ? 1 : 0.5, transition: 'all 0.2s ease' }}
        >
          Save & Finish <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function AgentSetup() {
  const navigate = useNavigate();
  const [[step, direction], setStep] = useState<[number, number]>([1, 1]);
  const [agentType, setAgentType] = useState<'b2b' | 'b2c' | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (agentType) {
      const settings = getSettings();
      setWebhookUrl(agentType === 'b2b' ? settings.b2bWebhookUrl : settings.b2cWebhookUrl);
    }
  }, [agentType]);

  function goNext() {
    setStep([step + 1, 1]);
  }

  function goBack() {
    setStep([step - 1, -1]);
  }

  function handleFinish() {
    navigate('/campaigns');
  }

  function handleSetupOther() {
    setAgentType(agentType === 'b2b' ? 'b2c' : 'b2b');
    setWebhookUrl('');
    setStep([1, -1]);
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings2 size={20} color="#60a5fa" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Agent Setup Wizard</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Configure your Dialora AI calling agent in 4 steps</p>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar step={step} />

      {/* Step content with framer transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {step === 1 && (
            <StepChooseType
              agentType={agentType}
              setAgentType={setAgentType}
              onNext={goNext}
            />
          )}
          {step === 2 && agentType && (
            <StepScriptPreview
              agentType={agentType}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepVoiceSettings
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && agentType && (
            <StepConnect
              agentType={agentType}
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              onBack={goBack}
              onFinish={handleFinish}
              onSetupOther={handleSetupOther}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
