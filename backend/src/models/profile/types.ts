export type UserRole = 'employee' | 'admin';

export interface ProfileInterface {
    id: string;
    email: string;
    full_name: string;
    department: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdatePayload {
    full_name?: string;
    department?: string;
}
