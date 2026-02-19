export const products = [
  {
    emoji: '🚨',
    name: 'Accident Insurance',
    description: 'Cash benefits for out-of-pocket costs from unexpected injuries — ER visits, fractures, burns, ligament damage',
    hook: 'If you slip and land in the ER, your health plan covers some of it — you cover the rest. This pays you cash for that gap.',
    color: '#ef4444',
  },
  {
    emoji: '💊',
    name: 'Critical Illness Insurance',
    description: 'Lump sum up to $50,000 paid directly to you upon diagnosis of cancer, heart attack, stroke, or other covered critical illness',
    hook: 'The average first-year cost after a cancer diagnosis is over $42,000. This pays you cash so finances are the last thing you worry about.',
    color: '#8b5cf6',
  },
  {
    emoji: '🎗️',
    name: 'Cancer Insurance',
    description: 'Dedicated cash benefits specifically for cancer treatment, diagnostics, and recovery — fast payout',
    hook: 'One in three Americans will face cancer. This policy pays cash from day one — treatments, travel, lost income, whatever you need it for.',
    color: '#ec4899',
  },
  {
    emoji: '💼',
    name: 'Disability Insurance',
    description: 'Replaces a portion of income if you\'re sick or injured and can\'t work',
    hook: 'Your biggest financial asset is your ability to earn a paycheck. This protects it.',
    color: '#f59e0b',
  },
  {
    emoji: '🏥',
    name: 'Hospital Insurance',
    description: 'Cash benefits for covered hospital admissions and confinement',
    hook: 'HDHPs leave employees with thousands in deductibles when hospitalized. This pays cash for every day you\'re in.',
    color: '#3b82f6',
  },
  {
    emoji: '👨‍👩‍👧',
    name: 'Life Insurance',
    description: 'Lump sum to cover final expenses and maintain family lifestyle after loss of a loved one',
    hook: 'It\'s about making sure one tragedy doesn\'t become two — one person, then the family\'s financial future.',
    color: '#14b8a6',
  },
  {
    emoji: '🐾',
    name: 'Pet Insurance',
    description: 'Accident and illness coverage for dogs and cats — no max annual or lifetime payouts, 2-day reimbursement',
    hook: '77% of employees want pet benefits. It\'s one of the fastest-growing benefit requests and costs you nothing to offer.',
    color: '#10b981',
  },
];

export const competitorData = {
  rows: [
    { label: 'Parent Company', combined: 'Chubb — world\'s largest publicly traded P&C insurer; S&P 500', aflac: 'Independent; NYSE: AFL', unum: 'Independent; NYSE: UNM' },
    { label: 'Financial Rating', combined: 'A+ Superior (AM Best); A+ BBB', aflac: 'A+ AM Best', unum: 'A AM Best' },
    { label: 'Years in Business', combined: '100+ years (founded 1922)', aflac: 'Founded 1955 (70 years)', unum: 'Founded 1848 — different focus' },
    { label: 'Global Footprint', combined: '54 countries via Chubb backing', aflac: 'US & Japan primary', unum: 'Primarily US & UK' },
    { label: 'Employer Cost', combined: '$0 — 100% employee-paid via payroll deduction', aflac: '$0 — employee-paid', unum: '$0 — employee-paid' },
    { label: 'Admin Overhead', combined: 'Minimal — dedicated account exec handles enrollment education', aflac: 'Self-serve enrollment', unum: 'Digital HR platform but complex' },
    { label: 'Cancer Coverage', combined: 'Dedicated cancer policy with fast cash payout', aflac: 'Strong cancer product', unum: 'Less specialized' },
    { label: 'Critical Illness Payout', combined: 'Lump sum up to $50,000 — paid directly to you', aflac: 'Lump sum payout', unum: 'Lump sum payout' },
    { label: 'Best For', combined: 'Small/mid-size employers, individual & family, all sizes', aflac: 'Small-large employers', unum: 'Mid-large employers only' },
  ],
};

export const b2bObjections = [
  {
    question: '"We already have benefits through [carrier]"',
    answer: 'Absolutely — most companies we work with do. What Combined layers on top is supplemental protection that your health plan doesn\'t touch: cash directly to employees for accidents, critical illness, cancer, or disability income. It doesn\'t replace what you have — it fills the gaps. And it costs your company nothing. Worth a 20-minute look?',
  },
  {
    question: '"We can\'t take on more admin complexity"',
    answer: 'I completely understand — benefits admin is already a full-time job. Here\'s the thing: Combined\'s account executives manage the entire employee education and enrollment process. We sit down with your employees, explain the options, and handle the paperwork. Your HR team\'s involvement is minimal. The employees who choose coverage pay through payroll deduction. That\'s it.',
  },
  {
    question: '"Our employees can\'t afford more deductions from their paycheck"',
    answer: 'That\'s a real concern and it\'s worth addressing directly. The average Combined supplemental policy runs a few dollars a week — often less than a daily coffee. But more importantly: the employees who can least afford extra deductions are often the ones most financially exposed when they miss two weeks of work with a broken arm or a cancer diagnosis. The conversation about affordability is one our specialists are very good at having honestly with your team.',
  },
  {
    question: '"Not interested"',
    answer: 'No problem at all, {{first_name}}. Is it okay if I at least send you a one-page overview for your records? No obligation — if it\'s useful during your next open enrollment review, great. If not, nothing lost.',
  },
  {
    question: '"Send me something in writing"',
    answer: 'Absolutely — I\'ll get that out today. Just so I can make sure it\'s relevant: what\'s your current headcount, and do you do an annual open enrollment period? That way I can make sure what we send actually applies to your situation.',
  },
];

export const b2cObjections = [
  {
    question: '"I already have health insurance"',
    answer: 'That\'s great — health insurance is essential. But here\'s the gap most people don\'t realize until they\'re in it: health insurance pays the hospital and the doctor. It doesn\'t replace your income if you can\'t work. It doesn\'t cover the rent when you\'re recovering. Combined Insurance pays cash directly to you for exactly those situations — on top of whatever your health plan already covers.',
  },
  {
    question: '"I can\'t afford more insurance"',
    answer: 'That\'s fair — and I won\'t pretend it\'s nothing. But let me ask: if you missed four weeks of work tomorrow because of an accident or illness, what would that cost you? For most people, that math is a lot scarier than a few dollars a week in premiums. Our specialist can walk you through actual numbers — no obligation to buy anything — and you can decide if it makes sense for your situation.',
  },
  {
    question: '"I\'m healthy — I don\'t need it"',
    answer: 'That\'s actually when it\'s the best time to get it — when you\'re healthy, coverage is less expensive and easier to qualify for. The point isn\'t that something will definitely happen. It\'s that if it does, you\'re not making financial decisions during the worst moment of your life. One in three Americans faces a cancer diagnosis. The ones who planned ahead are the ones who get to focus on recovery instead of bills.',
  },
  {
    question: '"How did you get my number?"',
    answer: 'Your information was provided through our opt-in outreach program. If you\'d prefer not to be contacted, I\'ll remove you from our list right now — absolutely no problem. Is that what you\'d like, or would you be open to a quick overview of what we offer?',
  },
  {
    question: '"I need to talk to my spouse / partner first"',
    answer: 'Of course — that makes complete sense. Would it be useful if I scheduled a 15-minute call with both of you? That way you can both hear the information at the same time and decide together. What works for your schedules this week?',
  },
];

export const leadOutcomes = [
  {
    emoji: '🔥',
    label: 'HOT',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    definition: 'Agreed to talk now or within 24 hrs',
    close: '"Let me connect you with our specialist right now — one moment."',
    next: 'Live transfer or same-day callback by licensed agent',
  },
  {
    emoji: '🌡️',
    label: 'WARM',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    definition: 'Interested, needs time or more info',
    close: '"Let\'s lock in a specific time — how does {{day}} at {{time}} work?"',
    next: 'Book calendar slot, send overview email, tag as priority follow-up',
  },
  {
    emoji: '❄️',
    label: 'COLD',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.3)',
    definition: 'Mild interest, not ready to commit',
    close: '"I\'ll send you our overview — no pressure. Would it be okay to follow up in a few weeks?"',
    next: 'Capture email, add to email nurture sequence, retarget in 21 days',
  },
  {
    emoji: '🚫',
    label: 'NOT INTERESTED',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.06)',
    border: 'rgba(148,163,184,0.2)',
    definition: 'Clear, firm rejection',
    close: '"Completely understood — I\'ll take you off our list. Thank you for your time, {{first_name}}."',
    next: 'Add to internal DNC immediately. Do not re-contact.',
  },
  {
    emoji: '📅',
    label: 'CALLBACK',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.3)',
    definition: 'Good prospect, bad timing',
    close: '"Absolutely — when is a better time? I want to put it in the calendar right now."',
    next: 'Book exact date/time, set follow-up reminder, note context',
  },
  {
    emoji: '📱',
    label: 'VOICEMAIL',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.3)',
    definition: 'No answer — left voicemail',
    close: '"[Voicemail script executed]"',
    next: 'Log VM left, retry once after 4+ hours, second VM attempt after 48 hrs',
  },
];

export const complianceRules = [
  'Never claim to be human when sincerely asked — Alex must identify as an automated system',
  'Never quote specific premium prices — only licensed agents can do this',
  'Never accept payment or bind coverage during a call',
  'Honor all Do Not Call requests IMMEDIATELY — log and remove from list',
  'Only call between 8:00 AM and 9:00 PM prospect local time',
  'Maximum 2 retry attempts per contact (TCPA-safe limit)',
  'Always state the callback number in voicemails',
  'Maintain internal DNC list — scrub before every campaign upload',
  'Check National DNC Registry before uploading any lead list',
  'State-specific disclosures may apply — consult your compliance team',
];

export const marketStats = [
  { value: '77%', label: 'of employees would consider leaving due to inadequate benefits', source: 'Combined Insurance Research' },
  { value: '80%', label: 'of employers say supplemental insurance helps retain employees', source: 'Aflac WorkForces Report 2024' },
  { value: '$42K+', label: 'average first-year cost after a cancer diagnosis', source: 'American Cancer Society' },
  { value: '1 in 3', label: 'Americans will receive a cancer diagnosis in their lifetime', source: 'National Cancer Institute' },
  { value: '$0', label: 'cost to employer — 100% employee-funded via payroll deduction', source: 'Combined Insurance' },
];
