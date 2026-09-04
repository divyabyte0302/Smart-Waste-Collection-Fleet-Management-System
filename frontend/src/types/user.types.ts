export type UserRole = 'Citizen' | 'Administrator' | 'Collection Staff';

export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: string;
  city?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
