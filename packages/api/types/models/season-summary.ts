export interface UserStat {
  user_id: number;
  fullname: string;
  total_tasks?: number;
  total_hour?: number;
  total_solo?: number;
  total_rnd?: number;
  total_verified?: number;
  total_bug?: number;
}

export interface ProjectStat {
  project_id: number;
  project_name: string;
  total_hours: number;
}

export interface ReportData {
  total_iteration: number;
  total_story: number;
  top_projects: ProjectStat[];
  total_tasks_by_users: UserStat[];
  total_hours_committed_by_user: UserStat[];
  total_solo_by_users: UserStat[];
  total_rnd_by_users: UserStat[];
  total_verified_by_users: UserStat[];
  total_bug_by_users: UserStat[];
}

export interface Season {
  season_name: string;
  start_date: string;
  end_date: string;
  team: number;
  report_data: ReportData;
}
