export type Business = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  businessType?: number;
  description?: string;
  address?: string;
  isActive?: boolean;
  responsibleUserName?: string;
}


export interface BusinessStats {
  activeBusinesses: number;
  inactiveBusinesses: number;
  suspendedBusinesses: number;
  totalBusinesses?: number;
}

export interface CreateBusinessDto {
  name: string;
  email: string;
  phone?: string;
  businessType: number;
  description?: string;
  address?: string;
  isActive?: boolean;
  responsibleUserEmail?: string;
  responsibleUserRoles?: string[];
}

export interface UpdateBusinessDto extends CreateBusinessDto {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export const BusinessType = {
  Restaurant: 1,
  Drugstore: 2,
  Supermarket: 3
} as const;

export type BusinessType = typeof BusinessType[keyof typeof BusinessType];

export const UserRole = {
  Admin: 'Admin',
  Manager: 'Manager',
  Staff: 'Staff',
  Owner: 'Owner'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];