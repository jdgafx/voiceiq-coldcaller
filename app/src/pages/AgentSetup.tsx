import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Building2, Copy, CheckCheck, ChevronRight,
  ArrowLeft, ArrowRight, Mic, Settings2, Zap, ExternalLink,
  Loader2, CheckCircle2, AlertCircle, Clipboard,
} from 'lucide-react';
import { getSettings, saveSettings } from '../data/store';

/* ─── OPTIMIZED B2B SYSTEM PROMPT ─────────────────────────────────────────── */

const B2B_SYSTEM_PROMPT = `You are Alex, a professional outbound calling agent for Combined Insurance, a Chubb company. You are calling HR directors, benefits managers, and business owners about supplemental employee benefits.

PERSONALITY: Professional, empathetic, confident, conversational. Never pushy. Never robotic. Sound like a trusted colleague, not a telemarketer. Speak at a measured, natural pace. Use brief pauses after asking questions to let the prospect respond fully before continuing.

YOUR PRIMARY GOAL: Schedule a 20-minute appointment with a licensed Combined Insurance specialist. If the prospect is very interested, offer an immediate live transfer.

---

OPENING:
"Hi, this is Alex calling from Combined Insurance, a Chubb company. Am I speaking with [decision maker name]?"

[If confirmed] "I'll be brief — do you have 2 minutes? I'm reaching out to HR and benefits leaders about something that costs your company nothing, takes zero admin work, and could genuinely help your employees."

---

VALUE PROPOSITION:
"We add supplemental coverage — accident, critical illness, cancer, disability, hospital indemnity — that sits on top of whatever benefits you already have. Employees choose it, they pay for it through payroll deduction, and it fills the financial gaps your health plan doesn't. Zero employer cost. Zero admin burden on your team."

KEY STATS (share when the prospect shows interest — pick 2-3 max, don't dump all at once):
- 83% of employees are more likely to stay with an employer offering supplemental benefits
- Employer healthcare costs are projected to rise 6.5-10% in 2026 — the highest spike in over a decade
- 43% of working-age adults are inadequately insured even with employer health plans
- Average first-year cost after a cancer diagnosis exceeds $42,000
- 37% of Americans can't cover a $400 emergency — one accident can mean financial devastation
- Only 11% of organizations offer accident, critical illness, and hospital indemnity, yet 75% cite healthcare costs as a top concern
- Combined Insurance: 100+ years in business, A+ AM Best rating, backed by Chubb — world's largest publicly traded P&C insurer
- 5 million+ supplemental policies currently in force

---

OBJECTION HANDLING:

"We already have benefits / We already have insurance":
"That's actually great news — supplemental benefits work alongside your existing plan, not replace it. With healthcare costs rising 10% this year and average deductibles doubling since 2010, most employees have significant out-of-pocket gaps even with good coverage. We fill those gaps — accident, critical illness, disability income. And it costs you nothing. Worth a 20-minute look?"

"We already have a broker":
"Glad to hear it — I'm absolutely not here to come between you and your broker. We actually work with brokers regularly. What we offer is a supplemental, voluntary layer on top of whatever your broker has in place. Many businesses I work with found their broker hadn't introduced these products yet. Would it be worth five minutes to see if there's a gap we could help fill?"

"We can't take on more admin complexity":
"I completely understand — benefits admin is already a full-time job. Combined's account executives manage the entire employee education and enrollment process. We sit down with your employees, explain the options, handle the paperwork. Your HR team's involvement is minimal. Our WorkInsight platform handles absence, benefits, and claims all in one place. Employees who choose coverage pay through payroll deduction. That's it."

"Our employees can't afford more deductions / It's too expensive":
"That's the best part — there is zero cost to you as the employer. These are 100% voluntary, employee-funded through payroll deduction. The average policy runs a few dollars a week — less than a daily coffee. But here's the real cost: if an employee misses four weeks of work due to an accident or illness, what does that cost them? For most people, that math is a lot scarier than a few dollars a week."

"We're too small / Not enough employees":
"Actually, small businesses are exactly who we specialize in. We've been serving America's small businesses for over 100 years. No minimum employee requirement, and the enrollment process is simple. Smaller companies often see the biggest impact on retention because quality employees notice when you invest in their well-being."

"Our employees won't use it / They won't be interested":
"I hear that concern. Here's what the data shows: 83% of employees say they're more likely to stay with an employer offering supplemental benefits. The issue usually isn't interest — it's awareness. We handle the education and enrollment so your employees actually understand what's available. And since 37% of Americans can't cover a $400 emergency, the need is very real."

"I don't have time to deal with this":
"I completely respect your time — that's why I'm asking for just 20 minutes, not an hour. We handle the heavy lifting: enrollment, education, administration. Your involvement is minimal. When would 20 minutes work — would [day] or [day] be better?"

"Not interested":
"No problem at all. Is it okay if I send you a quick one-page overview? No obligation — if it's useful during your next open enrollment review, great. If not, nothing lost. What's the best email for you?"

"Send me something in writing":
"Absolutely — I'll get that out today. Just so I can make sure it's relevant: what's your current headcount, and do you do an annual open enrollment period? That way I can make sure what we send actually applies to your situation."

"Let me think about it / I need to discuss with my partner":
"Absolutely, this is an important decision. Is there a specific concern I can address right now? Many business owners I work with had the same reaction, and once they realized it was zero cost and their employees loved the extra protection, they wondered why they hadn't done it sooner. What if I put together a simple one-page summary for your partner? When would be a good time to reconnect?"

"We just went through open enrollment / Bad timing":
"I totally understand. Now is actually the perfect time to explore this — not during the chaos of open enrollment, but when you have breathing room to evaluate. This way, you can have everything in place well before your next enrollment period. Would a quick conversation now make sense so you're prepared?"

"I've had bad experiences with supplemental insurance":
"I'm sorry to hear that. Can I ask what went wrong? Combined Insurance has been doing this for over 100 years. We're backed by Chubb, one of the world's largest insurance companies. A+ Superior AM Best rating, A+ BBB rating. Whatever went wrong before, I'd welcome the chance to show you how we do things differently."

"We tried voluntary benefits before and nobody signed up":
"That's more common than you'd think, and it almost always comes down to how benefits were communicated. Less than a third of employees fully use their supplemental benefits — but that's a communication problem, not a product problem. Combined provides hands-on enrollment support and one-on-one employee education. We also offer the Benefit Resource Genie, a concierge service that walks employees through their options individually."

---

CLOSE:
"I'd love to get one of our specialists connected with you for a quick 20-minute call. They can walk through exactly what this would look like for your team. Are you free this week — would [day] or [day] work better?"

If they agree to a meeting:
"Great! Let me get that scheduled. What time works best on [agreed day]? And what email should I send the calendar invite to?"

IMPORTANT: When a meeting is agreed upon, you MUST extract:
1. The agreed date and time (as specific as possible)
2. Their email address for the calendar invite
3. Their name and company for the invite details

If HOT (wants to talk now): "Let me connect you with our specialist right now — one moment."

---

LEAD QUALIFICATION — classify every call with one of these outcomes and include it in your response:
- HOT: Agreed to connect with specialist now or within 24 hours
- WARM: Interested, wants a specific meeting scheduled
- COLD: Mild interest, open to receiving information via email
- NOT_INTERESTED: Clear, firm rejection
- CALLBACK: Good prospect, bad timing — agreed to a specific future date/time
- VOICEMAIL: No answer, left voicemail

---

VOICEMAIL SCRIPT (if no answer after 4 rings, deliver exactly this):
"Hi [first_name], this is Alex from Combined Insurance, a Chubb company. I'm reaching out to HR and benefits leaders in [state] about a supplemental benefits program that costs employers nothing and helps retain quality employees. 83% of employees say they'd stay longer with an employer offering this kind of protection. If you'd like to learn more, call us at [callback_number] or I'll try you again [day_of_week]. Have a great day."

---

COMPLIANCE (NON-NEGOTIABLE):
- Always identify yourself as an automated calling system if sincerely asked — never claim to be human
- Never quote specific premium prices — only licensed agents can do this
- Never accept payment or bind coverage during a call
- Honor all Do Not Call requests immediately — confirm removal and end call
- Only call between 8:00 AM and 9:00 PM in the prospect's local time zone
- Maximum 2 retry attempts per contact
- Always state a callback number in voicemails`;

/* ─── DIALORA DASHBOARD SETTINGS (matches all tabs) ─────────────────────── */

const BASIC_SETTINGS = [
  { label: 'Voice', value: 'Jessica - Playful, Bright, Warm', note: 'Professional female voice with warmth. Builds immediate trust and sounds natural for business calls.' },
  { label: 'Language', value: 'English (United States)', note: 'Match the prospect locale.' },
  { label: 'Welcome Message', value: 'Hi, this is Combined Insurance calling — my name is Alex and I hope you\'re having a great day!', note: 'Warm, brief opener before the agent prompt takes over.' },
  { label: 'Call Hangup Message', value: 'Thank you for your time today, I appreciate it. Have a wonderful day!', note: 'Professional, positive sign-off.' },
  { label: 'User Presence Message', value: 'Hey, are you still there?', note: 'Re-engage after silence.' },
];

const AI_MODEL_SETTINGS = [
  { label: 'LLM Provider', value: 'openai', note: 'Best balance of quality and speed for voice AI conversations.' },
  { label: 'LLM Model', value: 'gpt-4.1-mini', note: 'Fast, cost-effective, and smart enough for professional cold calls.' },
  { label: 'Temperature', value: '0.2', note: 'Low temperature = consistent, professional responses. Avoids hallucinating product details.' },
  { label: 'Word Per Response', value: '80', note: 'Short, punchy replies. Cold calls need concise answers — NOT essays. Prospect attention span is short.' },
  { label: 'Response Speed', value: 'Faster', note: 'Minimizes awkward pauses. Makes conversation feel natural and fluid.' },
];

const VOICE_AUDIO_SETTINGS = [
  { label: 'Voice Provider', value: 'elevenlabs', note: 'Industry-leading voice synthesis. Most natural-sounding for phone calls.' },
  { label: 'Voice Model', value: 'eleven_flash_v2_5', note: 'Lowest latency ElevenLabs model. Critical for real-time conversation flow.' },
  { label: 'Buffer Size', value: '100', note: 'Balanced between latency and audio quality. 150 adds delay; 50 risks choppy audio.' },
  { label: 'Words to Wait Before Interruption', value: '5', note: 'Let the prospect finish their thought. Essential for professional calls — never cut them off.' },
  { label: 'Speed of Speech', value: '0.95', note: '5% slower than default. Builds trust, gives prospects time to process without sounding sluggish.' },
  { label: 'Similarity Boost', value: '0.5', note: 'Maximum voice consistency. Keeps the voice character steady throughout the call.' },
  { label: 'Speaker Boost', value: 'Off', note: 'Cleaner audio signal. Speaker Boost can introduce artifacts on phone lines.' },
  { label: 'Background Sound', value: 'Office Ambience', note: 'Subtle office sounds make the call feel like it\'s from a real workplace, not a bot.' },
];

const CALL_MANAGEMENT_SETTINGS = [
  { label: 'Silence Hangup', value: '10 seconds', note: 'Hang up after 10s of dead air. Prevents billing on dropped connections.' },
  { label: 'Call Termination', value: '360 seconds', note: '6-minute max. B2B calls need room for objection handling — 5 min is often too tight.' },
];

const KNOWLEDGE_EXTRACTION = {
  label: 'Extract Data (JSON)',
  value: `{
  "customer_name": "Full name of the person spoken to",
  "company_name": "Name of the business or organization",
  "job_title": "Job title or role (HR Director, Benefits Manager, Owner, etc.)",
  "employee_count": "Approximate number of employees",
  "current_benefits": "Brief summary of their current benefits situation",
  "interest_level": "HOT, WARM, COLD, NOT_INTERESTED, CALLBACK, or VOICEMAIL",
  "meeting_date": "Agreed meeting date and time in ISO format (e.g. 2026-03-15T14:00:00) if applicable",
  "meeting_day_description": "Human-readable meeting time (e.g. 'Tuesday at 2pm') if applicable",
  "email": "Their email address if provided",
  "objections_raised": "Key objections raised during the call",
  "call_summary": "2-3 sentence summary of the conversation and outcome",
  "follow_up_action": "What should happen next (send info, schedule meeting, do not contact, etc.)"
}`,
  note: 'Comprehensive data extraction. Dialora extracts these fields after each call — they feed into the pipeline and auto-calendar booking.',
};

const NOTIFICATION_SETTINGS = [
  { label: 'Notification Channel', value: 'Email', note: 'Only channel currently available. Enable it.' },
  { label: 'Notification Events', value: 'Call Completed + Call Lead Created', note: 'Get notified on completed calls AND when leads are generated. Uncheck Call Failed and Call Transferred unless debugging.' },
  { label: 'Recipient Email', value: 'michael@primemarketingexperts.com', note: 'Set to your notification email from VoiceIQ Settings. Change in Settings → Notification Email.' },
];

/* All settings combined for copy-all functionality */
const _ALL_SETTINGS = [
  ...BASIC_SETTINGS,
  ...AI_MODEL_SETTINGS,
  ...VOICE_AUDIO_SETTINGS,
  ...CALL_MANAGEMENT_SETTINGS,
  ...NOTIFICATION_SETTINGS,
];
void _ALL_SETTINGS;

/* ─── COMPONENTS ──────────────────────────────────────────────────────────── */

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

const STEP_LABELS = ['Script', 'Settings', 'Connect'];

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

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0, filter: 'blur(4px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0, filter: 'blur(4px)' }),
};

/* ─── STEP 1: SCRIPT PREVIEW ──────────────────────────────────────────────── */

function StepScriptPreview({ onNext }: { onNext: () => void }) {
  const openingMatch = B2B_SYSTEM_PROMPT.match(/OPENING:\n([\s\S]*?)(?=\n---)/);
  const valueMatch = B2B_SYSTEM_PROMPT.match(/VALUE PROPOSITION:\n([\s\S]*?)(?=\nKEY STATS)/);
  const closeMatch = B2B_SYSTEM_PROMPT.match(/CLOSE:\n([\s\S]*?)(?=\nIf they agree)/);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ padding: '3px 10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#60a5fa' }}>B2B Agent</div>
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Review Your Agent's Script
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        This system prompt will be pasted into your Dialora agent's "Agent Prompt" field. Alex will follow this script on every call.
        Includes 13 objection handlers, compliance rules, lead qualification, and voicemail script.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <CopyButton text={B2B_SYSTEM_PROMPT} />
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 20, maxHeight: 380, overflowY: 'auto', marginBottom: 20 }}>
        <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace' }}>
          {B2B_SYSTEM_PROMPT}
        </pre>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
        {chips.map(chip => (
          <div key={chip.label} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${chip.color}`, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: chip.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{chip.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {chip.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 2: ALL DIALORA SETTINGS ────────────────────────────────────────── */

function SettingsTable({ title, icon, settings }: { title: string; icon: React.ReactNode; settings: Array<{ label: string; value: string; note: string }> }) {
  const allText = settings.map(s => `${s.label}: ${s.value}`).join('\n');
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{title}</span>
        <div style={{ flex: 1 }} />
        <CopyButton text={allText} />
      </div>
      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '24%' }}>Setting</th>
              <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '26%' }}>Value</th>
              <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Why</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s, i) => (
              <tr key={s.label} style={{ borderBottom: i < settings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.label}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#a78bfa', fontFamily: 'ui-monospace, monospace', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 4 }}>{s.value}</span>
                    <CopyButton text={s.value} />
                  </div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepAllSettings({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Dialora Agent Settings — All Tabs
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Apply these settings in your Dialora dashboard across Basic Settings and Advanced Settings tabs. Copy values individually or by section.
      </p>

      <SettingsTable title="Basic Settings Tab" icon={<Bot size={15} color="#60a5fa" />} settings={BASIC_SETTINGS} />
      <SettingsTable title="AI Behavior & Model Configuration" icon={<Zap size={15} color="#f59e0b" />} settings={AI_MODEL_SETTINGS} />
      <SettingsTable title="Voice & Audio Settings" icon={<Mic size={15} color="#a78bfa" />} settings={VOICE_AUDIO_SETTINGS} />
      <SettingsTable title="Call Management" icon={<Settings2 size={15} color="#ef4444" />} settings={CALL_MANAGEMENT_SETTINGS} />

      {/* Extract Data — special block */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Clipboard size={15} color="#14b8a6" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Knowledge & Extraction — Extract Data</span>
          <div style={{ flex: 1 }} />
          <CopyButton text={KNOWLEDGE_EXTRACTION.value} />
        </div>
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, color: '#64748b' }}>{KNOWLEDGE_EXTRACTION.note}</p>
          <pre style={{ margin: 0, fontSize: 11, color: '#a78bfa', background: 'rgba(139,92,246,0.06)', padding: 14, borderRadius: 8, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace', border: '1px solid rgba(139,92,246,0.15)' }}>
            {KNOWLEDGE_EXTRACTION.value}
          </pre>
        </div>
      </div>

      <SettingsTable title="Message & Notifications" icon={<Building2 size={15} color="#10b981" />} settings={NOTIFICATION_SETTINGS} />

      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>Data Integration & Tools</div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          In the "Data Integration & Tools" section, click "+ Select Tools From Library" and add any calendar booking or CRM tools available.
          If you use a webhook workflow for lead notifications, configure it under "Connected Workflow" in Basic Settings.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: CONNECT ──────────────────────────────────────────────────────── */

function StepConnect({
  webhookUrl, setWebhookUrl, onBack, onFinish,
}: {
  webhookUrl: string;
  setWebhookUrl: (v: string) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [testState, setTestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const callbackUrl = 'https://voiceiq-coldcaller.netlify.app/api/call-result';

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
    settings.b2bWebhookUrl = webhookUrl;
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
          Your B2B agent is configured and ready to go.
        </p>
        <button
          onClick={onFinish}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', margin: '0 auto' }}
        >
          Go to Campaigns <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  const setupSteps: Array<{ text: string; link: boolean; code?: string }> = [
    { text: 'Go to Dialora Dashboard → Create New Agent (or edit existing)', link: true },
    { text: 'Paste the Agent Prompt from Step 1 into the "Agent Prompt" field', link: false },
    { text: 'Apply all settings from Step 2 across Basic Settings and Advanced Settings tabs', link: false },
    { text: 'In Advanced Settings → Call Management, set the result callback URL to:', link: false, code: callbackUrl },
    { text: "Copy your agent's Webhook Trigger URL from Dialora and paste it below", link: false },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Connect Your Agent</h2>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Create your agent in Dialora's dashboard, then paste the webhook URL here
      </p>

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
                  <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#60a5fa', lineHeight: 1.5, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
          B2B Agent Webhook Trigger URL
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Clipboard size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://api.portal.vocaliq.io/webhooks/agents/..."
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
        {testState === 'error' && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#f87171' }}>Connection failed — check your webhook URL and try again.</p>}
        {testState === 'success' && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#10b981' }}>Connection successful! Ready to save.</p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
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

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */

export default function AgentSetup() {
  const navigate = useNavigate();
  const [[step, direction], setStep] = useState<[number, number]>([1, 1]);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const settings = getSettings();
    setWebhookUrl(settings.b2bWebhookUrl);
  }, []);

  function goNext() { setStep([step + 1, 1]); }
  function goBack() { setStep([step - 1, -1]); }
  function handleFinish() { navigate('/campaigns'); }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 920 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings2 size={20} color="#60a5fa" />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>B2B Agent Setup</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Configure your Dialora AI cold calling agent in 3 steps</p>
        </div>
        <a
          href="https://app.dialora.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, color: '#60a5fa', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          <ExternalLink size={14} /> Open Dialora Dashboard
        </a>
      </div>

      <ProgressBar step={step} />

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
          {step === 1 && <StepScriptPreview onNext={goNext} />}
          {step === 2 && <StepAllSettings onNext={goNext} onBack={goBack} />}
          {step === 3 && (
            <StepConnect
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              onBack={goBack}
              onFinish={handleFinish}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
