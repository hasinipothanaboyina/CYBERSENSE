export type SubmissionKind = 'email' | 'url' | 'text' | 'file';
export type EvidenceType = 'verified' | 'heuristic' | 'ai_assessed';
export type RiskBand = 'Low' | 'Medium' | 'High' | 'Critical';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface ThreatDNASignal {
  name: string;
  score: number | 'Unavailable';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNAVAILABLE';
  evidence: string;
}

export interface AttackChainStep {
  step: string;
  status: 'detected' | 'potential' | 'mitigated';
  detail: string;
}

export interface Finding {
  id: string;
  category: string;
  evidence: EvidenceType;
  source: string;
  detail: string;
  points: number;
}

export interface Telemetry {
  entropyScore?: number;
  urlLength?: number;
  subdomainCount?: number;
  specialCharCount?: number;
  httpsStatus?: boolean;
  domainAge?: string;
  ipAddress?: string;
}

export interface DomainIntelligence {
  domain?: string;
  ipInfo?: string;
  dnsRecords?: string;
  registrar?: string;
  redirects?: string;
  reputation?: string;
}

export interface AnalysisResult {
  id: string;
  submissionId: string;
  urlOrTarget: string;
  kind: SubmissionKind;
  riskScore: number;
  band: RiskBand;
  confidence: ConfidenceLevel;
  classification: string;
  summary: string;
  threatDna: ThreatDNASignal[];
  attackChain: AttackChainStep[];
  findings: Finding[];
  recommendedActions: string[];
  limitations: string[];
  createdAt: string;
  senderInfo?: {
    from: string;
    replyTo: string;
    dmarcStatus: string;
    spfStatus: string;
  };
  telemetry?: Telemetry;
  domainIntelligence?: DomainIntelligence;
  attachmentInfo?: {
    filename: string;
    size: string;
    sha256: string;
    mimeDetected: string;
  };
}

export interface SubmissionItem {
  id: string;
  target: string;
  kind: SubmissionKind;
  riskScore: number;
  band: RiskBand;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  content: string[];
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'admin';
  riskScore: number;
  trainingScore: number;
  totalScans: number;
  reportedPhishCount: number;
  failedSimulations: number;
}

export interface Incident {
  id: string;
  target: string;
  severity: 'High' | 'Critical';
  status: 'Open' | 'Investigating' | 'Resolved';
  assignedTo: string;
  date: string;
}

export interface Campaign {
  id: string;
  name: string;
  targetCount: number;
  openRate: number;
  clickRate: number;
  reportRate: number;
  status: 'Active' | 'Completed' | 'Draft';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'threat' | 'analysis' | 'awareness' | 'system';
  isRead: boolean;
  createdAt: string;
}
