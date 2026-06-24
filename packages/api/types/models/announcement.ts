import { Team } from "./team";
import { User } from "./user";

export interface Announcement {
  id: number;
  name: string;
  team: Team | number;
  created_by: User | number;
  start_date: string; 
  end_date: string; 
  description: string;
  is_live: boolean;
  is_active: boolean;
  create_at: string;
  update_at: string;
  hashid: string;
}

export interface AnnouncementFormData {
  name: string;
  team: number;
  start_date: string;
  end_date: string;
  description: string;
  is_live?: boolean;
}