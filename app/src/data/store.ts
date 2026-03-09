import type { Campaign, AppSettings } from '../types';

const CAMPAIGNS_KEY = 'voiceiq_campaigns';
const SETTINGS_KEY = 'voiceiq_settings';

export function getCampaigns(): Campaign[] {
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const idx = campaigns.findIndex(c => c.id === campaign.id);
  if (idx >= 0) {
    campaigns[idx] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter(c => c.id !== id);
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function getCampaignById(id: string): Campaign | undefined {
  return getCampaigns().find(c => c.id === id);
}

export function getSettings(): AppSettings {
  const defaults: AppSettings = {
    b2bWebhookUrl: '',
    defaultTimezone: 'America/New_York',
    delayBetweenCalls: 5,
    notificationEmail: 'michael@primemarketingexperts.com',
    calendarEmail: 'michael@primemarketingexperts.com',
  };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (_) {
    return defaults;
  }
  return defaults;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
