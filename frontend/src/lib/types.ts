export type UserRole = "employee" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  department: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLeaveRequest extends LeaveRequest {
  profiles: {
    full_name: string;
    email: string;
    department: string | null;
  } | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
}

export interface AuthResult {
  profile: Profile;
  session: Session | null;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  data: null;
}
