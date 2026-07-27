export type AccessUserRole = "user" | "manager" | "admin";

export type AccessUser = {
  id: string;
  crmId?: string;
  login: string;
  normalizedLogin: string;
  displayName: string;
  email?: string;
  phone?: string;
  role: AccessUserRole;
  active: boolean;
  archived: boolean;
  manual?: boolean;
  source?: "crm" | "manual";
  passwordResetRequested?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
};
