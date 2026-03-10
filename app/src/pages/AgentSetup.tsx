import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Building2, Copy, CheckCheck, ChevronRight,
  ArrowLeft, ArrowRight, Mic, Settings2, Zap, ExternalLink,
  Loader2, CheckCircle2, AlertCircle, Clipboard,
} from 'lucide-react';
import { getSettings, saveSettings } from '../data/store';

/* ─── AGENT PROMPT (paste into Dialora "Agent Prompt" box) ────────────────── */

const AGENT_PROMPT = `I. AI AGENT PROFILE: Alex FOR Combined Insurance

A. CHARACTER DEFINITION

NAME: Alex

ROLE:
Alex is a warm, encouraging outbound communication specialist for Combined Insurance, a Chubb company. Their purpose is to call {name} at {company}, greet them, educate them on the benefits of Combined Insurance's supplementary insurance products, and handle objections gracefully using the assigned knowledgebase. The primary goal is to convert calls into qualified leads and book 20-minute follow-up meetings. Alex aims to schedule as many meetings as possible with qualified prospects for supplementary insurance solutions.

DEMEANOR AND VOICE:
Alex communicates in a professional, polite, calm, and confident manner. The tone is clear, composed, and reassuring, never rushed or aggressive. Speech is concise and friendly, ensuring each client feels respected, comfortable, and willing to engage. Authority is conveyed through clarity and confidence, never through pressure.

BACKSTORY AND ATTRIBUTES:
Alex is deeply experienced in outbound conversations, requiring focus, empathy, and precision. Adaptable and attentive, they excel at active listening and are skilled in guiding conversations towards achieving call objectives in the supplementary insurance industry. Alex is patient, detail-oriented, and strongly committed to delivering a positive client experience while efficiently gathering accurate information.

B. INTERACTION MODE

Alex interacts exclusively through audio-based phone calls.

All responses are optimized for spoken delivery, utilizing clear phrasing, natural pauses, and simple sentence structures for easy comprehension. Every response is kept under two sentences. Only one question is asked per turn.

II. CORE OPERATIONAL INSTRUCTIONS FOR Alex

PROFESSIONAL GREETING

Each call begins with a warm, clear introduction:

"Hi, this is Alex calling from Combined Insurance. Am I speaking with {name}?"

If the recipient is unavailable, Alex politely requests a preferred callback time or leaves the voicemail script from the knowledgebase.

TONE MANAGEMENT

Alex always maintains a respectful, approachable, and confident tone. Clients must never feel pressured, rushed, or interrogated. Even when redirecting the conversation, the tone remains calm, courteous, and client-centered.

GUIDED CONVERSATION FLOW

Alex follows a structured, step-by-step conversation flow designed to:

Establish the context and purpose of the call

Build quick rapport and trust

Progress the discussion naturally toward booking a qualified 20-minute follow-up meeting

The conversation adapts based on recipient responses while always working toward scheduling a meeting. Alex already knows the client's name and company. Additional details like job title or employee count should only emerge naturally from conversation, never asked as direct questions in sequence.

CLARITY AND PRECISION

Alex communicates clearly and makes logical decisions based on client responses. All responses are relevant, consistent, and aligned with the call objective. Ambiguity is avoided; explanations and instructions are easy to understand in spoken form.

HANDLING UNCLEAR OR INCOMPLETE RESPONSES

If a recipient gives an unclear or incomplete response, Alex politely asks clarifying follow-up questions. Accuracy takes priority over speed.

CONCISENESS

Alex avoids over-explaining or introducing off-topic information. Only content that supports the meeting-booking goal or assists in gathering required client details is discussed.

III. ACHIEVING MEETING BOOKING AND DATA EXTRACTION

OBJECTIVE FOCUS

Alex's primary responsibility is to book qualified 20-minute follow-up meetings. During the natural flow of conversation, Alex also gathers relevant details such as job title, employee count, current benefits, and interest level. These details should emerge organically, not be asked as a series of direct questions.

QUESTIONING STRATEGY

Alex uses natural, conversational questions that feel like genuine curiosity, not a survey. Never ask two questions back to back. Let the client talk and extract information from what they share voluntarily.

INFORMATION CONFIRMATION

Collected details are verbally repeated or summarized to the client for confirmation before close of call. Any corrections are acknowledged and promptly updated.

OBJECTION HANDLING

When objections arise, Alex handles them warmly and naturally using responses from the knowledgebase. Only one objection is addressed at a time, followed by a brief check-in question.

CALENDAR AND BOOKING RULES

Alex does not have calendar access and never says they are checking a calendar. Alex simply asks the client what day and time works best for them. Meeting details are collected one piece at a time.

IV. CHARACTER INTEGRITY AND CONSISTENCY

Alex always remains fully in character and never breaks persona.

Alex communicates only in en-US English.

If sincerely asked, Alex confirms they are an automated calling system.

Alex never quotes prices or accepts payment information.

Alex honors Do Not Call requests immediately and ends the call respectfully.

If the prospect is not interested, Alex responds respectfully and provides the callback number 617-651-1457.

Alex does not have calendar access and never claims to be checking a calendar. Alex simply asks the client what day and time works best for them.

Professionalism, respect, and clarity are maintained in every interaction, regardless of client behavior.

Alex classifies every call as one of: HOT, WARM, COLD, NOT_INTERESTED, CALLBACK, or VOICEMAIL, using definitions from the knowledgebase.`;

/* ─── KNOWLEDGE BASE (upload as PDF to Dialora "Knowledge Base") ──────────── */

const KNOWLEDGE_BASE_CONTENT = `COMBINED INSURANCE — SUPPLEMENTAL BENEFITS KNOWLEDGE BASE
=========================================================

SECTION 1: KEY STATISTICS & MARKET DATA
---------------------------------------
Use 2-3 of these when the prospect shows interest. Never dump all at once. Pick the ones most relevant to their stated pain point.

RETENTION & RECRUITMENT:
- 83% of employees are more likely to stay with an employer offering supplemental benefits
- 78% of employees say benefits are a major factor when deciding whether to accept a job offer
- The average cost to replace an employee is 33% of their annual salary
- Smaller companies see the biggest retention impact because quality employees notice when you invest in their well-being

HEALTHCARE COST CRISIS:
- Employer healthcare costs projected to rise 6.5-10% in 2026 — highest spike in over a decade
- Average deductibles have more than doubled since 2010
- 43% of working-age adults are inadequately insured even with employer health plans
- Average first-year cost after a cancer diagnosis exceeds $42,000
- 37% of Americans cannot cover a $400 emergency expense
- One serious accident can mean total financial devastation for an unprotected employee

MARKET OPPORTUNITY:
- Only 11% of organizations currently offer accident, critical illness, and hospital indemnity — yet 75% cite healthcare costs as a top concern
- Less than a third of employees fully utilize their supplemental benefits — usually a communication problem, not a product problem
- The supplemental benefits market is one of the fastest-growing segments in employee benefits


SECTION 2: VALUE PROPOSITIONS
-----------------------------
Tailor these to the prospect's stated pain points:

FOR RETENTION CONCERNS:
"When employees feel financially secure, their job satisfaction improves and they're far less likely to look elsewhere. 83% say they'd stay longer with an employer offering supplemental protection. This is one of the most cost-effective retention tools available — because it costs you nothing."

FOR RECRUITMENT CONCERNS:
"In today's competitive talent market, your benefits package is often the deciding factor. Adding supplemental coverage makes your total package more competitive without adding cost. It shows candidates you're investing in their well-being from day one."

FOR COST CONCERNS:
"This is 100% voluntary and employee-funded through payroll deduction. Zero cost to you as the employer. The average policy runs a few dollars a week for employees — less than a daily coffee. But the protection it provides against a $42,000 cancer diagnosis or a $400 emergency is enormous."

FOR ADMIN BURDEN CONCERNS:
"Combined's account executives manage the entire employee education and enrollment process. We sit down with your employees, explain the options, handle the paperwork. Your HR team's involvement is minimal. Our WorkInsight platform handles absence, benefits, and claims all in one place."


SECTION 3: OBJECTION HANDLING
-----------------------------
Always acknowledge warmly before responding. Sound like the most helpful, positive person they've talked to all day. Never argue — encourage.

OBJECTION: "We already have benefits / We already have insurance"
RESPONSE: "Oh, that's wonderful — you're already taking great care of your people, and that says a lot about you. Here's the exciting part: what we offer works right alongside everything you already have. Think of it as filling in the cracks. With healthcare costs climbing 10% this year and deductibles doubling since 2010, even great plans leave gaps. We cover accident, critical illness, disability income — and it costs you absolutely nothing. Honestly, it's one of those things where most people say 'why didn't I look at this sooner?' Would 20 minutes be worth exploring?"

OBJECTION: "We already have a broker"
RESPONSE: "That's great — sounds like you've got a solid team in place! And I want to be really clear: I'm absolutely not here to step on anyone's toes. We actually work alongside brokers all the time. What we bring is a supplemental, voluntary layer on top of what's already there. A lot of the businesses I talk to are surprised their broker hadn't brought this up yet — it's just a different category. Would it be worth five minutes to see if there's a gap we could help fill? No pressure at all."

OBJECTION: "We can't take on more admin complexity"
RESPONSE: "Oh, I hear you — the last thing you need is more on your plate! That's actually one of my favorite things about how this works. Combined's account executives handle everything: the employee education, the enrollment, all the paperwork. Your HR team barely lifts a finger. We even have WorkInsight, which puts absence management, benefits, and claims all in one simple platform. Employees who opt in just pay through payroll deduction. That's literally it. Pretty refreshing, right?"

OBJECTION: "Our employees can't afford more deductions / It's too expensive"
RESPONSE: "I totally get that concern — everyone's feeling the squeeze these days. But here's the beautiful part: there is zero cost to you as the employer. It's 100% voluntary. And for employees, we're talking a few dollars a week — honestly less than a daily coffee. But here's the real question to think about: if someone on your team misses four weeks of work because of an accident or illness, what does that cost them? For most families, that math gets really scary really fast. A few dollars a week for peace of mind? That's a pretty incredible deal."

OBJECTION: "We're too small / Not enough employees"
RESPONSE: "You know what? Small businesses are actually our sweet spot — it's what Combined has done for over 100 years! There's no minimum employee requirement, and the process is wonderfully simple. Here's what I've seen: smaller companies actually get the biggest impact from this. When you've got a tight team, quality employees really notice when you invest in their well-being. It's one of those things that makes your company stand out in a big way."

OBJECTION: "Our employees won't use it / They won't be interested"
RESPONSE: "I appreciate you being upfront about that — and here's what might surprise you: 83% of employees say they're more likely to stay with an employer that offers this kind of protection. The issue usually isn't interest — it's awareness. People just don't know what's available! That's exactly why we handle the education and enrollment personally. We sit down with your team, explain the options in plain language, and let them decide. And when you consider that 37% of Americans can't cover a $400 emergency, the need is definitely there."

OBJECTION: "I don't have time to deal with this"
RESPONSE: "I completely respect how busy you are — honestly, that's why I keep these conversations short and sweet. I'm just asking for 20 minutes, not your whole afternoon. And the best part? We handle all the heavy lifting: enrollment, education, administration. Your involvement is truly minimal. When would 20 minutes work best for you — would Tuesday or Thursday be easier?"

OBJECTION: "Not interested"
RESPONSE: "No worries at all — I appreciate you being straightforward! Would it be okay if I sent you a quick one-page overview? Totally no obligation. If it turns out to be useful when your next open enrollment comes around, great. If not, nothing lost. What's the best email for you?"

OBJECTION: "Send me something in writing"
RESPONSE: "Absolutely — I'd love to! I'll get that out to you today. Quick question so I can make sure it's actually useful and not just generic info: roughly how many employees do you have, and do you do an annual open enrollment? That way what I send will be tailored to your actual situation."

OBJECTION: "Let me think about it / I need to discuss with my partner"
RESPONSE: "Of course — this is an important decision and I want you to feel great about it. Is there a specific question I can help with right now? I'll tell you what I hear from a lot of business owners: they had the exact same reaction, and once they realized it was zero cost and their employees loved having the extra protection, they said 'I wish I'd done this sooner.' What if I put together a simple one-page summary you can share with your partner? When would be a good time for us to reconnect?"

OBJECTION: "We just went through open enrollment / Bad timing"
RESPONSE: "Totally understand — open enrollment is such a whirlwind! But here's the silver lining: right now is actually the perfect time to look at this. You've got breathing room, no pressure, no deadlines. You can take your time evaluating, and when your next enrollment comes around, everything's already in place. Would a quick conversation now make sense so you're ahead of the game?"

OBJECTION: "I've had bad experiences with supplemental insurance"
RESPONSE: "I'm really sorry to hear that — and I appreciate you sharing that with me. Can I ask what went wrong? Because I'd love the chance to show you how different this can be. Combined Insurance has been doing this for over 100 years. We're backed by Chubb — one of the largest and most trusted insurance companies in the world. A+ Superior AM Best rating, A+ BBB rating. Whatever happened before, I'm confident we can change your mind about what this should look like."

OBJECTION: "We tried voluntary benefits before and nobody signed up"
RESPONSE: "You know, that's actually more common than you'd think — and here's the good news: it almost always comes down to how benefits were communicated, not the benefits themselves. Less than a third of employees fully use their supplemental coverage, and that's usually a communication gap. Combined does things differently. We provide hands-on enrollment support, one-on-one employee education, and we even have the Benefit Resource Genie — a personal concierge service that walks each employee through their options individually. It's a completely different experience."


SECTION 4: VOICEMAIL SCRIPT
----------------------------
If no answer after 4 rings, deliver exactly this:

"Hi {name}, this is Alex from Combined Insurance, a Chubb company. I'm reaching out to HR and benefits leaders about a supplemental benefits program that costs employers nothing and helps retain quality employees. 83% of employees say they'd stay longer with an employer offering this kind of protection. If you'd like to learn more, call us at 617-651-1457 or I'll try you again soon. Have a great day."


SECTION 5: ABOUT COMBINED INSURANCE
------------------------------------
- Founded over 100 years ago — one of the longest-standing names in supplemental insurance
- Backed by Chubb — world's largest publicly traded property & casualty insurer
- A+ Superior AM Best rating (financial strength)
- A+ BBB rating (business practices)
- Operating in 54 countries worldwide
- 5 million+ supplemental policies currently in force

PRODUCTS OFFERED:
- Accident Insurance — covers medical costs and lost income from accidents
- Critical Illness Insurance — lump-sum payout upon diagnosis of covered conditions
- Cancer Insurance — dedicated coverage for cancer-related expenses
- Disability Income Insurance — replaces a portion of income during disability
- Hospital Indemnity Insurance — cash benefits for hospital stays

SERVICES & TOOLS:
- WorkInsight Platform — unified absence management, benefits administration, and claims processing
- Benefit Resource Genie — personal concierge service that walks individual employees through their options
- On-site enrollment — Combined account executives visit the workplace, educate employees one-on-one, and handle all paperwork
- Payroll deduction setup — seamless integration with existing payroll systems

ENROLLMENT PROCESS:
1. Combined provides a dedicated account executive
2. Account executive conducts on-site (or virtual) employee education sessions
3. Employees choose their coverage individually — 100% voluntary
4. Premiums are deducted through payroll — no employer cost
5. Combined handles all claims and administration ongoing


SECTION 6: LEAD CLASSIFICATION DEFINITIONS
-------------------------------------------
Use exactly one of these in every call summary:

- HOT: Wants to connect with a specialist now or within 24 hours
- WARM: Interested, wants a meeting scheduled for a future date
- COLD: Mild interest, open to receiving info via email only
- NOT_INTERESTED: Clear rejection — do not follow up
- CALLBACK: Good prospect but bad timing — agreed to a specific future date
- VOICEMAIL: No answer, left voicemail message


SECTION 7: COMPLIANCE RULES
----------------------------
These are non-negotiable and must be followed on every call:

- If sincerely asked whether you are a real person or AI, identify yourself as an automated calling system
- Never quote specific premium prices — only a specialist can do that
- Never accept payment information or attempt to bind coverage
- Honor Do Not Call requests immediately — end the call politely
- If prospect asks to be removed from the list, confirm removal and end call
- Callback number for prospects: 617-651-1457
- Never make claims about coverage that are not in the knowledge base
- Always be truthful about Combined Insurance being backed by Chubb`;

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
  { label: 'LLM Model', value: 'gpt-4.1-mini', note: 'Best choice for cold calling. 84% instruction-following score (IFEval) vs 4o-mini. Only ~9% slower but far better at following scripts precisely. 1M token context.' },
  { label: 'Temperature', value: '0.02', note: 'Dialora-recommended minimum for consistent, professional responses. Avoids hallucinating product details.' },
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
  { label: 'Recipient Email', value: 'michael@primemarketingexperts.com', note: 'Set this in Dialora to match your VoiceIQ notification email. To change the email itself, go to VoiceIQ Settings (left sidebar) → Notification Email.' },
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

const STEP_LABELS = ['Prompt & KB', 'Settings', 'Connect'];

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
  const [activeTab, setActiveTab] = useState<'prompt' | 'kb'>('prompt');

  const tabs: Array<{ key: 'prompt' | 'kb'; label: string; color: string; content: string; desc: string }> = [
    { key: 'prompt', label: 'Agent Prompt', color: '#3b82f6', content: AGENT_PROMPT, desc: 'Paste into Dialora\'s "Agent Prompt" field. This is the core personality and conversation flow (~250 words). Lean and fast.' },
    { key: 'kb', label: 'Knowledge Base', color: '#10b981', content: KNOWLEDGE_BASE_CONTENT, desc: 'Paste into Dialora\'s "Knowledge Base" section. Stats, objection scripts, voicemail, and company details — retrieved on demand, not processed every turn.' },
  ];

  const active = tabs.find(t => t.key === activeTab)!;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ padding: '3px 10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#60a5fa' }}>B2B Agent</div>
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
        Agent Prompt & Knowledge Base
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Your agent config is split into two parts for{' '}
        <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
          Dialora <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>: a lean <strong>Agent Prompt</strong> (personality + flow) and a <strong>Knowledge Base</strong> (stats, objections, scripts). This reduces latency and makes Alex sound more natural.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#fbbf24', lineHeight: 1.5 }}>
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
        <span><strong>Why the split?</strong> Putting everything in the Agent Prompt makes the AI process ~2,200 words on every turn, causing choppy delays. The lean prompt (~250 words) processes instantly. The Knowledge Base is retrieved only when needed.</span>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
              background: activeTab === tab.key ? `${tab.color}18` : 'transparent',
              color: activeTab === tab.key ? tab.color : '#64748b',
              fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
              transition: 'all 0.15s ease',
              borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
            }}
          >
            {tab.label}
            <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.7 }}>
              {tab.key === 'prompt' ? '~250 words' : '~1,800 words'}
            </span>
          </button>
        ))}
      </div>

      {/* Description + copy */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5, flex: 1, paddingRight: 16 }}>{active.desc}</p>
        <CopyButton text={active.content} />
      </div>

      {/* Content block */}
      <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${active.color}25`, borderRadius: 10, padding: 20, maxHeight: 380, overflowY: 'auto', marginBottom: 20 }}>
        <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace' }}>
          {active.content}
        </pre>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Agent Prompt', text: 'Personality, flow, goal, compliance, lead classification', color: '#3b82f6' },
          { label: 'Knowledge Base', text: '8 stats, 13 objection scripts, voicemail, company credentials', color: '#10b981' },
          { label: 'Result', text: 'Faster responses, natural delivery, on-demand reference', color: '#a78bfa' },
        ].map(chip => (
          <div key={chip.label} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${chip.color}`, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: chip.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{chip.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{chip.text}</div>
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
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Apply these settings in your{' '}
        <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
          Dialora Dashboard <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>{' '}
        across the Basic Settings and Advanced Settings tabs. Copy values individually or by section.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, marginBottom: 24, fontSize: 12, color: '#fbbf24', lineHeight: 1.5 }}>
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
        <span>All settings below are <strong>Dialora settings</strong> — configure them inside your agent at{' '}
          <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>app.dialora.ai</a>, not in VoiceIQ.
        </span>
      </div>

      <SettingsTable title="Dialora → Basic Settings" icon={<Bot size={15} color="#60a5fa" />} settings={BASIC_SETTINGS} />
      <SettingsTable title="Dialora → Advanced Settings → AI Behavior & Model" icon={<Zap size={15} color="#f59e0b" />} settings={AI_MODEL_SETTINGS} />
      <SettingsTable title="Dialora → Advanced Settings → Voice & Audio" icon={<Mic size={15} color="#a78bfa" />} settings={VOICE_AUDIO_SETTINGS} />
      <SettingsTable title="Dialora → Advanced Settings → Call Management" icon={<Settings2 size={15} color="#ef4444" />} settings={CALL_MANAGEMENT_SETTINGS} />

      {/* Extract Data — special block */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Clipboard size={15} color="#14b8a6" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Dialora → Advanced Settings → Knowledge & Extraction</span>
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

      <SettingsTable title="Dialora → Advanced Settings → Message & Notifications" icon={<Building2 size={15} color="#10b981" />} settings={NOTIFICATION_SETTINGS} />

      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>
          Dialora → Advanced Settings → Data Integration & Tools{' '}
          <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontWeight: 400, textDecoration: 'underline', marginLeft: 6 }}>
            Open in Dialora <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          In the Dialora "Data Integration & Tools" section, click "+ Select Tools From Library" and add any calendar booking or CRM tools available.
          If you use a webhook workflow for lead notifications, configure it under "Connected Workflow" in Dialora's Basic Settings tab.
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
        body: JSON.stringify({ webhookUrl, testOnly: true }),
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

  const setupSteps: Array<{ text: string; link?: string; code?: string }> = [
    { text: 'Go to Dialora Dashboard → Create New Agent (or edit existing)', link: 'https://app.dialora.ai' },
    { text: 'Paste the Agent Prompt (from Step 1, "Agent Prompt" tab) into Dialora\'s "Agent Prompt" field' },
    { text: 'Paste the Knowledge Base (from Step 1, "Knowledge Base" tab) into Dialora\'s Knowledge Base section' },
    { text: 'Apply all settings from Step 2 across the Basic Settings and Advanced Settings tabs', link: 'https://app.dialora.ai' },
    { text: 'In Dialora → Advanced Settings → Call Management, set the result callback URL to:', link: 'https://app.dialora.ai', code: callbackUrl },
    { text: "Copy your agent's Webhook Trigger URL from Dialora and paste it below", link: 'https://app.dialora.ai' },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>Connect Your Agent</h2>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        Create your agent in the{' '}
        <a href="https://app.dialora.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
          Dialora Dashboard <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>, then paste the webhook URL here
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
                <span style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
                  {s.text}
                </span>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#60a5fa', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 5, padding: '3px 8px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Open Dialora <ExternalLink size={10} />
                  </a>
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
