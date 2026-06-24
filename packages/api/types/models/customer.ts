import { Role } from "./role";

export interface User {
  id?: string;
  uuid?: string;

  username?: string;
  email?: string;
  fullname?: string;
  calling_iso?: string; 
  calling_code?: string;
  contact?: string;
  ic?: string;
  bumiputra_status?: string;

  is_active?: boolean;
  is_verify?: boolean;
  date_joined?: string;
  last_login?: string;
  ex_role?: any;

  feature_access?: string[];
  is_complete_profile?: boolean;
  token_count?: number;
  tags?: string[];

  sales_executive?: User;
  sales_manager?: User;

  customer_type?: string;
  contact_display?: string;
  is_rsku?: boolean;
  is_oku?: boolean;
  is_superuser?: boolean;
  is_external?: boolean;
  is_business_user?: boolean;
  is_sales_person?: boolean;

  create_by?: string;
  update_by?: string;
  update_at?: string;
  customer_declare_at?: string;
  oku_document?: any;
  salesforce_id?: string;
  hashid?: string;

  role?: Role;
  is_customer?: boolean;
}

export interface UserDocument {
  id?: string;
  uuid?: string;
  created_by?: string;
  created_at?: string;

  customer?: number;
  name?: string;
  document?: any;
}

export interface UserFilter {
  search?: string;
  keyword?: string;
  role?: string;
  customer_type?: string;
  bumiputra_status?: string;
  is_active?: boolean;
  is_verify?: boolean;
  is_customer?: boolean;
  is_rsku?: boolean;
  is_oku?: boolean;
  is_superuser?: boolean;
  is_external?: boolean;
  is_business_user?: boolean;
  is_sales_person?: boolean;
  date_joined_from?: string;
  date_joined_to?: string;
  last_login_from?: string;
  last_login_to?: string;
}


export type UserSortField = 
  | 'date_joined'
  | 'last_login'
  | 'fullname'
  | 'email'
  | 'contact'
  | 'customer_type'
  | 'bumiputra_status'
  | 'role'
  | 'is_active'
  | 'is_verify';

export interface UserListResponse {
  users: User[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from?: number;
    to?: number;
  };
}

export interface UserResponse {
  user: User;
}

export interface UserPayload {
  username?: string;
  email: string;
  fullname: string;
  calling_iso?: string;
  calling_code?: string;
  contact?: string;
  ic?: string;
  bumiputra_status?: string;
  customer_type?: string;
  is_active?: boolean;
  role_id?: string;
  feature_access?: string[];
  tags?: string[];
  
  sales_executive_id?: string;
  sales_manager_id?: string;
  
  is_oku?: boolean;
  is_external?: boolean;
  is_business_user?: boolean;
  is_sales_person?: boolean;
}

export interface UserUpdatePayload extends Partial<UserPayload> {
  id: string;
}

export interface UserStatusPayload {
  id: string;
  is_active: boolean;
}

export interface UserRoleUpdatePayload {
  id: string;
  role: string;
}

export interface UserQueryParams {
  search?: string;
  keyword?: string;
  page?: number;
  per_page?: number;
  sort?: string[];
  filter?: UserFilter;
  include?: string[];
}

export enum CustomerType {
  EMPLOYEE = 'employee',
  PRIME = 'prime',
  EARLY_BIRD = 'earlybird',
  PUBLIC = 'public',
}

export enum BumiputraStatus {
  BUMIPUTRA = 'bumiputra',
  NON_BUMIPUTRA = 'non-bumiputra',
  UNSPECIFIED = 'unspecified',
  NA = 'N/A',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum OpportunityStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserVerificationStatus {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
}

export const CustomerTypeOption = new Map<string, any>([
  [
    CustomerType.EMPLOYEE,
    {
      name: "Employee",
      chipVariant: "blue",
      chipTextVariant: "Employee",
    },
  ],
  [
    CustomerType.PRIME,
    {
      name: "T Privilege",
      chipVariant: "orange",
      chipTextVariant: "T Privilege",
    },
  ],
  [
    CustomerType.EARLY_BIRD,
    {
      name: "Early Bird",
      chipVariant: "gray",
      chipTextVariant: "Early Bird",
    },
  ],
  [
    CustomerType.PUBLIC,
    {
      name: "Public",
      chipVariant: "purple",
      chipTextVariant: "Public",
    },
  ],
]);