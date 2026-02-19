import { useState } from 'react';
import { Bot, Copy, CheckCheck, ChevronDown, ChevronUp, Zap, Mic, Settings2, BookOpen } from 'lucide-react';

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
  { label: 'Agent Name', value: 'Alex', note: 'Warm, gender-neutral name. Use in all self-introductions.' },
  { label: 'Recommended Voice', value: 'Professional, warm (e.g. "Phoebe", "Rachel", or "Marcus")', note: 'Avoid overly robotic or overly casual voices. Select the most human-sounding option available.' },
  { label: 'Speaking Rate', value: '0.92x – 0.97x', note: 'Slightly slower than default. Allows prospect to process and builds trust. Never rush.' },
  { label: 'Silence / Pause Tolerance', value: '2.5 – 3.0 seconds', note: 'Wait this long for prospect response before continuing. Cold call prospects need a moment to process.' },
  { label: 'Interruption Threshold', value: 'Low sensitivity', note: 'Do not cut off the prospect. Let them finish speaking even if they pause mid-sentence.' },
  { label: 'Max Call Duration', value: '5 minutes (300 seconds)', note: 'Cold calls should be concise. If prospect is interested, close quickly to schedule follow-up.' },
  { label: 'LLM Temperature', value: '0.65 – 0.75', note: 'Low-to-medium. Professional calls require consistency, but slight variation keeps it human.' },
  { label: 'Voicemail Detection', value: 'Enabled', note: 'Leave the voicemail script if no answer after 4 rings. Do not leave repeated voicemails — 2 maximum per contact.' },
  { label: 'Background Noise', value: 'Disabled / Silent', note: 'Office background sounds reduce credibility for insurance calls. Keep clean audio.' },
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

function ExpandablePrompt({ title, prompt, color }: { title: string; prompt: string; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#0d0d14', border: `1px solid ${color}30`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={14} color={color} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{title}</span>
          <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>{prompt.split(' ').length} words</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CopyButton text={prompt} />
          {open ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
        </div>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '16px 20px' }}>
          <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace' }}>
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

const sectionCard: React.CSSProperties = {
  background: '#0d0d14',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  padding: 24,
  marginBottom: 20,
};

export default function AgentSetup() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="#2dd4bf" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Agent Setup</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Dialora AI configuration — copy these settings into your Dialora dashboard</p>
        </div>
      </div>

      <div style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 28, display: 'flex', gap: 10 }}>
        <Zap size={14} color="#2dd4bf" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
          Create two agents in your <strong style={{ color: '#e2e8f0' }}>Dialora dashboard</strong> — one B2B, one B2C. Paste the system prompt, apply the voice settings below, then copy each agent's webhook URL into <strong style={{ color: '#e2e8f0' }}>VoiceIQ → Settings</strong>. Set the callback URL in Dialora so call results auto-sync to your pipeline.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <BookOpen size={16} color="#60a5fa" />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>System Prompts</h2>
        <span style={{ fontSize: 11, color: '#475569' }}>— Click to expand, copy to Dialora</span>
      </div>

      <ExpandablePrompt title="B2B Agent — Alex (HR / Business Owners)" prompt={B2B_SYSTEM_PROMPT} color="#3b82f6" />
      <ExpandablePrompt title="B2C Agent — Alex (Individual Consumers)" prompt={B2C_SYSTEM_PROMPT} color="#14b8a6" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '28px 0 16px' }}>
        <Mic size={16} color="#a78bfa" />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>Voice & Behavior Settings</h2>
      </div>

      <div style={sectionCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '22%' }}>Setting</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '30%' }}>Value</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Why</th>
            </tr>
          </thead>
          <tbody>
            {VOICE_SETTINGS.map((s, i) => (
              <tr key={s.label} style={{ borderBottom: i < VOICE_SETTINGS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{s.label}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#a78bfa', fontFamily: 'ui-monospace, monospace', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 4 }}>{s.value}</span>
                    <CopyButton text={s.value} />
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '28px 0 16px' }}>
        <Settings2 size={16} color="#f59e0b" />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>Webhook Configuration</h2>
      </div>

      <div style={sectionCard}>
        {WEBHOOK_CONFIG.map((w, i) => (
          <div key={w.label} style={{ borderBottom: i < WEBHOOK_CONFIG.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < WEBHOOK_CONFIG.length - 1 ? 16 : 0, marginBottom: i < WEBHOOK_CONFIG.length - 1 ? 16 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{w.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
              <code style={{ flex: 1, fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, padding: '8px 12px', display: 'block', wordBreak: 'break-all', lineHeight: 1.6 }}>{w.value}</code>
              <CopyButton text={w.value} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{w.note}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '14px 18px', marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>Setup Checklist</div>
        {[
          'Create B2B agent in Dialora → paste B2B system prompt above',
          'Create B2C agent in Dialora → paste B2C system prompt above',
          'Apply voice settings to both agents',
          'Set Dialora callback URL to: https://voiceiq-coldcaller.netlify.app/api/call-result',
          'Map callback fields: contactId, campaignId, phone, status, duration, recording_url, transcript, lead_status',
          'Copy each agent\'s webhook URL → VoiceIQ Settings → B2B/B2C Webhook URL',
          'Create a campaign, import contacts, and hit Launch',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, fontSize: 13, color: '#94a3b8' }}>
            <span style={{ width: 18, height: 18, background: 'rgba(59,130,246,0.2)', borderRadius: '50%', fontSize: 10, fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
