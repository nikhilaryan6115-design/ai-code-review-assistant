import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Submission, 
  Developer, 
  Repository, 
  NotificationItem, 
  AISettings, 
  UserRole,
  Issue
} from '../types';
import { 
  initialSubmissions, 
  mockDevelopers, 
  mockRepositories, 
  initialNotifications, 
  defaultAISettings 
} from '../data/mockData';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  currentUser: {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    isGitHubAuth?: boolean;
    githubUsername?: string;
    isAuthenticated?: boolean;
  };
  submissions: Submission[];
  repositories: Repository[];
  developers: Developer[];
  notifications: NotificationItem[];
  aiSettings: AISettings;
  toasts: Toast[];
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  approveSubmission: (id: string, feedback?: string) => void;
  requestChanges: (id: string, feedback: string) => void;
  triggerAIScan: (submissionId: string) => void;
  applyIssueFix: (submissionId: string, issueId: string) => void;
  dismissIssue: (submissionId: string, issueId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateAISettings: (settings: Partial<AISettings>) => void;
  toggleAutoReview: (repoId: string) => void;
  connectNewRepository: (repo: Partial<Repository>) => void;
  refreshFromBackend: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('manager');
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [developers] = useState<Developer[]>(mockDevelopers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [aiSettings, setAISettings] = useState<AISettings>(defaultAISettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [backendUser, setBackendUser] = useState<any>(null);

  // Sync state from backend on mount
  const refreshFromBackend = async () => {
    try {
      const [authRes, reposRes, subsRes, notifsRes] = await Promise.allSettled([
        fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/repos').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/submissions').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/notifications').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (authRes.status === 'fulfilled' && authRes.value?.user) {
        setBackendUser(authRes.value.user);
        if (authRes.value.user.role) {
          setRole(authRes.value.user.role);
        }
      }

      if (reposRes.status === 'fulfilled' && reposRes.value?.repositories?.length > 0) {
        setRepositories(reposRes.value.repositories);
      }

      if (subsRes.status === 'fulfilled' && subsRes.value?.submissions?.length > 0) {
        setSubmissions(subsRes.value.submissions);
      }

      if (notifsRes.status === 'fulfilled' && notifsRes.value?.notifications?.length > 0) {
        setNotifications(notifsRes.value.notifications);
      }
    } catch {
      // Backend offline or running in mock mode
    }
  };

  useEffect(() => {
    refreshFromBackend();
  }, []);

  const currentUser = backendUser
    ? {
        id: backendUser.id,
        name: backendUser.name || backendUser.username || 'GitHub Engineer',
        email: backendUser.email || `${backendUser.username}@users.noreply.github.com`,
        avatar: backendUser.avatar || 'https://avatars.githubusercontent.com/u/0?v=4',
        role: backendUser.role === 'developer' ? 'Senior Software Engineer' : 'Director of Engineering',
        isGitHubAuth: true,
        githubUsername: backendUser.username,
        isAuthenticated: true,
      }
    : {
        id: undefined,
        name: 'Guest Engineer',
        email: 'guest@revai.local',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'Guest',
        isGitHubAuth: false,
        isAuthenticated: false,
      };

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleRole = () => {
    const nextRole = role === 'manager' ? 'developer' : 'manager';
    setRole(nextRole);
    addToast(
      'Role Switched',
      `Switched view to ${nextRole.toUpperCase()} mode.`,
      'info'
    );
  };

  const approveSubmission = (id: string, feedback: string = 'Approved after verification.') => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            status: 'approved',
            managerDecision: {
              decision: 'approved',
              decidedAt: new Date().toISOString(),
              managerName: currentUser.name,
              managerAvatar: currentUser.avatar,
              feedback,
              commentsCount: (sub.managerDecision?.commentsCount || 0) + 1
            }
          };
        }
        return sub;
      })
    );
    addToast('Pull Request Approved', `PR has been approved and developer notified.`, 'success');
  };

  const requestChanges = (id: string, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            status: 'changes_requested',
            managerDecision: {
              decision: 'changes_requested',
              decidedAt: new Date().toISOString(),
              managerName: currentUser.name,
              managerAvatar: currentUser.avatar,
              feedback,
              commentsCount: (sub.managerDecision?.commentsCount || 0) + 1
            }
          };
        }
        return sub;
      })
    );
    addToast('Changes Requested', `Feedback sent to developer. PR status updated.`, 'warning');
  };

  const triggerAIScan = (submissionId: string) => {
    // First set to reviewing
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: 'ai_reviewing' } : sub))
    );
    addToast('Qwen2.5-Coder 7B Triggered', 'Analyzing AST, dependencies, and vulnerability vectors...', 'info');

    // Simulate completion after 2.5 seconds
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) => {
          if (sub.id === submissionId) {
            return {
              ...sub,
              status: 'ai_completed',
              riskLevel: sub.riskScore > 75 ? 'critical' : sub.riskScore > 40 ? 'medium' : 'low',
              aiSummary: 'Qwen2.5-Coder 7B deep code review completed. Discovered potential edge-cases and security boundary recommendations.',
              reviewTimeSeconds: 12
            };
          }
          return sub;
        })
      );
      addToast('Analysis Complete', 'Qwen2.5-Coder report generated successfully.', 'success');
    }, 2500);
  };

  const applyIssueFix = (submissionId: string, issueId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const updatedIssues: Issue[] = sub.issues.map((iss) =>
            iss.id === issueId ? { ...iss, status: 'addressed' } : iss
          );
          return {
            ...sub,
            issues: updatedIssues,
            riskScore: Math.max(10, sub.riskScore - 25),
            riskLevel: (sub.riskScore - 25 <= 25 ? 'low' : 'medium')
          };
        }
        return sub;
      })
    );
    addToast('Fix Applied', 'Code suggestion marked as addressed. Risk recalculated.', 'success');
  };

  const dismissIssue = (submissionId: string, issueId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const updatedIssues: Issue[] = sub.issues.map((iss) =>
            iss.id === issueId ? { ...iss, status: 'dismissed' } : iss
          );
          return { ...sub, issues: updatedIssues };
        }
        return sub;
      })
    );
    addToast('Issue Dismissed', 'Warning marked as false-positive / accepted risk.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const updateAISettings = (newSettings: Partial<AISettings>) => {
    setAISettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings Saved', 'Qwen2.5-Coder 7B engine parameters updated.', 'success');
  };

  const toggleAutoReview = (repoId: string) => {
    setRepositories((prev) =>
      prev.map((repo) =>
        repo.id === repoId ? { ...repo, autoReviewEnabled: !repo.autoReviewEnabled } : repo
      )
    );
  };

  const connectNewRepository = (repoData: Partial<Repository>) => {
    const newRepo: Repository = {
      id: 'repo-' + Date.now(),
      name: repoData.name || 'new-service',
      fullName: `acme-org/${repoData.name || 'new-service'}`,
      description: repoData.description || 'Newly connected GitHub repository',
      language: repoData.language || 'TypeScript',
      stars: 1,
      forks: 0,
      defaultBranch: 'main',
      connectedAt: new Date().toISOString().split('T')[0],
      autoReviewEnabled: true,
      webhookStatus: 'active',
      activePrsCount: 0,
      totalReviewsCount: 0,
      riskProfile: 'low'
    };
    setRepositories((prev) => [newRepo, ...prev]);
    addToast('Repository Connected', `Linked ${newRepo.fullName} with active webhooks.`, 'success');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setBackendUser(null);
    window.location.href = '/login';
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        currentUser,
        submissions,
        repositories,
        developers,
        notifications,
        aiSettings,
        toasts,
        globalSearch,
        setGlobalSearch,
        addToast,
        removeToast,
        approveSubmission,
        requestChanges,
        triggerAIScan,
        applyIssueFix,
        dismissIssue,
        markNotificationRead,
        markAllNotificationsRead,
        updateAISettings,
        toggleAutoReview,
        connectNewRepository,
        refreshFromBackend,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
