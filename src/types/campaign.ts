export interface SubjectLine {
  text: string;
  type: 'Curiosity' | 'Urgency' | 'Benefit' | 'Direct' | 'Personalized' | string;
  predictedOpenRateScore: string;
}

export interface KeyBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface OfferBox {
  badge: string;
  headline: string;
  details: string;
  couponCode?: string;
}

export interface SocialProof {
  quote: string;
  author: string;
  metric?: string;
}

export interface CallToAction {
  text: string;
  url: string;
  subtext?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface BodyContent {
  greeting: string;
  intro: string;
  keyBenefits: KeyBenefit[];
  offerBox: OfferBox;
  socialProof: SocialProof;
  callToAction: CallToAction;
  secondaryOffer?: string;
  psLine: string;
  signoff: string;
}

export interface SpamAnalysis {
  deliverabilityScore: number;
  rating: string;
  spamTriggers: string[];
  deliverabilityTips: string[];
}

export interface CampaignEmail {
  id: string;
  sequenceStep: string;
  delayInfo: string;
  subjectLines: SubjectLine[];
  selectedSubjectIndex: number;
  preheader: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVisualPrompt: string;
  heroImageUrl?: string;
  heroImageSize?: '1K' | '2K' | '4K';
  bodyContent: BodyContent;
  spamAnalysis: SpamAnalysis;
}

export interface Campaign {
  campaignTitle: string;
  campaignSummary: string;
  targetAudiencePersona: string;
  recommendedSchedule: string;
  emails: CampaignEmail[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleTitle?: string;
}

export type ChatRoleKey = 'strategy_director' | 'copywriting_master' | 'speed_editor';

export interface ChatRoleInfo {
  id: ChatRoleKey;
  name: string;
  model: string;
  taskLevel: 'complex' | 'general' | 'fast';
  description: string;
  badge: string;
}
