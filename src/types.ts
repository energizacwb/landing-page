export type ICPKey = 'cobranca' | 'instituicoes-financeiras' | 'varejo' | 'educacao' | 'logistica' | 'imobiliarias' | 'advogados';

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface SolutionPoint {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface SocialProof {
  client: string;
  logoText: string;
  metric: string;
  resultText: string;
}

export interface CalculatorConfig {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputMin: number;
  inputMax: number;
  inputDefault: number;
  inputUnit: string;
  metrics: {
    label: string;
    formula: (val: number) => string;
    suffix: string;
    desc: string;
  }[];
}

export interface PricingPlan {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ICPConfig {
  slug: ICPKey;
  name: string;
  sector: string;
  titleTag: string;
  metaDescription: string;
  
  // Design system tokens (Tailwind classes)
  colorClass: {
    primary: string;       // e.g., 'bg-amber-600'
    primaryHover: string;  // e.g., 'hover:bg-amber-700'
    textAccent: string;    // e.g., 'text-amber-500'
    bgLight: string;       // e.g., 'bg-amber-50/50'
    borderAccent: string;  // e.g., 'border-amber-500'
    ringAccent: string;    // e.g., 'ring-amber-500'
    badge: string;         // e.g., 'bg-amber-100 text-amber-800'
    gradient: string;      // e.g., 'from-amber-600 to-orange-500'
  };

  headline: string;
  subheadline: string;
  ctaText: string;

  painTitle: string;
  painSubtitle: string;
  pains: PainPoint[];

  solutionTitle: string;
  solutionSubtitle: string;
  solutions: SolutionPoint[];

  socialProofTitle: string;
  socialProof: SocialProof[];

  calculator: CalculatorConfig;

  stepsTitle: string;
  steps: {
    step: string;
    title: string;
    description: string;
  }[];

  pricing: PricingPlan;

  objectionTitle: string;
  objectionText: string;

  faqs: FAQItem[];
  complianceTitle: string;
  complianceText: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  icp: ICPKey;
  volume: string;
  timestamp: string;
  status: 'Pendente' | 'Contatado' | 'Sincronizado';
}

export interface GTMEvent {
  id: string;
  eventName: string;
  icpSlug: ICPKey;
  elementId: string;
  timestamp: string;
  meta?: Record<string, any>;
}
