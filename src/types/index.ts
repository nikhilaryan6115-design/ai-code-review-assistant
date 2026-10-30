export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type IssueCategory = 'security' | 'performance' | 'quality' | 'bug';

export type ReviewStatus = 
  | 'ai_reviewing' 
  | 'ai_completed' 
  | 'changes_requested' 
  | 'approved' 
  | 'merged';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export type UserRole = 'manager' | 'developer';

export interface Issue {
  id: string;
  title: string;
  severity: Severity;
  category: IssueCategory;
  file: string;
  lineStart: number;
  lineEnd: number;
  explanation: string;
  whyItIsAProblem: string;
  suggestedSolution: string;
  originalSnippet: string;
  suggestedFixSnippet: string;
  cwe?: string;
  status: 'open' | 'addressed' | 'dismissed';
}

export interface CodeFile {
  filename: string;
  language: string;
  content: string;
  suggestedContent?: string;
  problematicLines: {
    line: number;
    severity: Severity;
    issueId: string;
    message: string;
  }[];
}

export interface ManagerDecision {
  decision: 'approved' | 'changes_requested';
  decidedAt: string;
  managerName: string;
  managerAvatar?: string;
  feedback: string;
  commentsCount?: number;
}

export interface Submission {
  id: string;
  prNumber: number;
  title: string;
  developer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  repository: {
    id: string;
    name: string;
    branch: string;
    targetBranch: string;
    url?: string;
  };
  submissionDate: string;
  language: string;
  status: ReviewStatus;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  aiModel: string;
  aiSummary: string;
  aiExplanation: string;
  filesChangedCount: number;
  additions: number;
  deletions: number;
  issues: Issue[];
  codeFiles: CodeFile[];
  managerDecision?: ManagerDecision;
  reviewTimeSeconds?: number;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  assignedRepositories: string[];
  totalSubmissions: number;
  pendingReviews: number;
  completedReviews: number;
  approvalRate: number; // percentage
  criticalIssuesPrevented: number;
  joinDate: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  defaultBranch: string;
  connectedAt: string;
  autoReviewEnabled: boolean;
  webhookStatus: 'active' | 'warning' | 'inactive';
  activePrsCount: number;
  totalReviewsCount: number;
  riskProfile: 'low' | 'medium' | 'high';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'approval' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
  submissionId?: string;
  prNumber?: number;
}

export interface AISettings {
  modelName: string;
  modelIdentifier: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  confidenceThreshold: number;
  enableSecurityScanning: boolean;
  enablePerformanceAudit: boolean;
  enableStyleQualityChecks: boolean;
  autoReviewDraftPRs: boolean;
  blockMergeOnCritical: boolean;
  systemPrompt: string;
}
