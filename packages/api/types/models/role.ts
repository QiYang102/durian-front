export interface Role {
  code?: string;
  name?: string;
  id?: string;
  is_therapist?: boolean;

  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

export interface RoleFeature {
  id: number;
  role: Role;
  feature: Feature;
}

export interface Feature {
  id: number;
  code: string;
  name: string;
  path: string;
  parent: string;
}
