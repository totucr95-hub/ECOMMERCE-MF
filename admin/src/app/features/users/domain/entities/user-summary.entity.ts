export interface UserSummary {
  id?: string;
  username?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  enabled?: boolean;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  roles?: string[];
  createdTimestamp?: number;
}
