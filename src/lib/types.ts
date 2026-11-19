export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string;
  bio?: string;
  plan: Plan;
  createdAt?: string;
}

export interface Tuition {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  applicantCount?: number;
}

export interface Application {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  tuitionIsActive?: boolean;
  tuitionApprovalStatus?: string;
}

export interface Payment {
  id: string;
  userEmail: string;
  userName: string;
  userRole: Role;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  revenue?: number;
}

export interface PublicStats {
  totalStudents: number;
  totalTutors: number;
  totalTuitions: number;
  totalApplications: number;
  successRate: number;
}

export interface StudentStats {
  totalApplications: number;
  accepted: number;
  pending: number;
  rejected: number;
  plan: Plan;
  recentApplications: Application[];
}

export interface TutorStats {
  totalTuitions: number;
  approvedTuitions: number;
  pendingApproval: number;
  activeTuitions: number;
  totalApplicants: number;
  pendingApplicants: number;
  plan: Plan;
  recentApplicants: Application[];
}

export interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalTuitions: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalApplications: number;
  totalRevenue: number;
  totalTransactions: number;
  recentPendingTuitions: Tuition[];
}

export interface TuitionFilterOptions {
  subjects: string[];
  classLevels: string[];
}
