import { api } from "./api-client";
import {
  AdminLeaveRequest,
  ApiEnvelope,
  AuthResult,
  LeaveRequest,
  LeaveStatus,
  Profile,
} from "./types";

// ---- Auth ----

export async function signup(payload: {
  email: string;
  password: string;
  full_name: string;
  department?: string;
}) {
  const { data } = await api.post<ApiEnvelope<AuthResult>>(
    "/auth/signup",
    payload
  );
  return data.data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<ApiEnvelope<AuthResult>>(
    "/auth/login",
    payload
  );
  return data.data;
}

// ---- Employee profile ----

export async function getProfile() {
  const { data } = await api.get<ApiEnvelope<Profile>>("/employee/profile");
  return data.data;
}

export async function updateProfile(payload: {
  full_name?: string;
  department?: string;
}) {
  const { data } = await api.patch<ApiEnvelope<Profile>>(
    "/employee/profile",
    payload
  );
  return data.data;
}

// ---- Leave (employee) ----

export async function applyLeave(payload: {
  start_date: string;
  end_date: string;
  reason: string;
}) {
  const { data } = await api.post<ApiEnvelope<LeaveRequest>>(
    "/leave",
    payload
  );
  return data.data;
}

export async function getMyLeaves() {
  const { data } = await api.get<ApiEnvelope<LeaveRequest[]>>("/leave");
  return data.data;
}

export async function cancelLeave(id: string) {
  const { data } = await api.patch<ApiEnvelope<LeaveRequest>>(
    `/leave/${id}/cancel`
  );
  return data.data;
}

// ---- Admin ----

export async function getAllLeaves(status?: LeaveStatus) {
  const { data } = await api.get<ApiEnvelope<AdminLeaveRequest[]>>(
    "/admin/leave-requests",
    { params: status ? { status } : undefined }
  );
  return data.data;
}

export async function approveLeave(id: string) {
  const { data } = await api.patch<ApiEnvelope<LeaveRequest>>(
    `/admin/leave-requests/${id}/approve`
  );
  return data.data;
}

export async function rejectLeave(id: string) {
  const { data } = await api.patch<ApiEnvelope<LeaveRequest>>(
    `/admin/leave-requests/${id}/reject`
  );
  return data.data;
}
