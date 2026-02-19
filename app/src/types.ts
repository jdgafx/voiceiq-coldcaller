export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  notes?: string;
  leadSource?: string;
  status: 'pending' | 'calling' | 'completed' | 'failed' | 'dnc';
  calledAt?: string;
  error?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'b2b' | 'b2c';
  webhookUrl: string;
  contacts: Contact[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  createdAt: string;
  timezone: string;
  delayBetweenCalls: number;
  callsSent: number;
}

export interface AppSettings {
  b2bWebhookUrl: string;
  b2cWebhookUrl: string;
  defaultTimezone: string;
  delayBetweenCalls: number;
}
