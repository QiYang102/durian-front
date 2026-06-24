import { User } from "./user";

export interface TeamMember {
    id?: number;
    name?: string;
    create_at?: string;
    create_by?: string;
    update_by?: string;
    user?: User;
    team?: number;
  }
  