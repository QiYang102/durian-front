import { User } from "./user";

export interface VerifiedByUser {
  id: number;
  story: number;
  iteration?: number;
  user?: User;
  total_hour_used?: number;
  is_active: boolean;
  create_at?: string;
  update_at?: string;
}
