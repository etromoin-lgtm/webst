export interface CaseStudyExternalLink {
  id: string;
  label: string;
  url: string;
  type: 'Client Website' | 'Live Product' | 'Project Demo' | 'Partner Website' | 'Other External Reference';
  display: boolean;
  favicon_url?: string;
  favicon_status?: 'found' | 'not_found' | 'invalid_url' | 'loading' | 'error';
  override_icon?: string;
  verified?: boolean;
  description?: string;
}

export interface CaseStudyGoal {
  metric: string;
  initial_value: string;
  unit: string;
  period: string;
  target?: string;
  source?: string;
}

export interface CaseStudyPhase {
  phase_number: number;
  title: string;
  duration: string;
  description: string;
  deliverables?: string[];
}

export interface CaseStudyFeature {
  title: string;
  description: string;
  image_url?: string;
}

export type MetricType = 'duration' | 'percentage' | 'currency' | 'count' | 'score';
export type MetricDirection = 'lower_is_better' | 'higher_is_better';

export interface CaseStudyBeforeAfterMetric {
  id: string;
  name: string;
  type: MetricType;
  before: number;
  after: number;
  unit: string;
  direction: MetricDirection;
  period: string;
  change_display?: string;
  evidence: string;
  verified: boolean;
  show_public: boolean;
  notes?: string;
}

export interface CaseStudyKeyResult {
  metric: string;
  label: string;
  unit?: string;
  context: string;
  verified: boolean;
}

export interface CaseStudyCustomTable {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
  notes?: string;
  visible: boolean;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export type CaseStudyStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface CaseStudy {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  industry: string;
  client_name: string;
  is_client_confidential: boolean;
  cover_image: string;
  duration: string;
  services: string[];
  technologies: string[];
  business_type: string;
  challenge_overview: string;
  challenge_points: string[];
  goals_baseline: CaseStudyGoal[];
  approach_phases: CaseStudyPhase[];
  solution_overview: string;
  solution_features: CaseStudyFeature[];
  solution_architecture_image?: string;
  before_after_metrics: CaseStudyBeforeAfterMetric[];
  key_results: CaseStudyKeyResult[];
  methodology: string;
  lessons_learned: string[];
  external_links: CaseStudyExternalLink[];
  custom_tables: CaseStudyCustomTable[];
  testimonial?: CaseStudyTestimonial | null;
  status: CaseStudyStatus;
  featured: boolean;
  featured_on_homepage?: boolean;
  featured_in_trusted_by?: boolean;
  embedded_link?: string;
  custom_favicon_url?: string;
  sort_order: number;
  author: string;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}
