export interface TaskHour {
  id?: number;
  name?: string;
  hour?: number;
  remain_hour?:number;
  status?:string;
  user?: number;
  task?: number;
  create_at?: string;
  create_by?: string;
  update_by?: string;
}
