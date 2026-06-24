export interface QueryParams {
  search?: string;
  sort?: string[];
  include?: string[];
  filter?: Record<string, string | string[]>;
  in?: Record<string, string | string[]>;
  per_page?: number;
  page?: number;
  bucket?: string;
  params?: Record<string, any>;
  tags?: string[];
  usage?: string;
  item_type?: string;
}

export interface Meta {
  page: number;
  per_page: number;
  total_results: number;
  total_pages: number;
}

export interface ProductTag {
  id: number;
  tag: number;
  product: number;
}

export interface Tag {
  id: number;
  name: string;
  count?: number | null;
}

export interface ServiceTag {
  id: number;
  tag: number;
  service: number;
}

export interface UserTag {
  id: number;
  tag: number;
  customer: number;
}

export enum OutletServiceMode {
  ALL = "all",
  ACTIVE = "active",
  IN_ACTIVE = "inactive",
}

export interface ItemTag {
  id: number;
  tag: number;
  item: number;
}

export enum TagType {
  PRODUCT = "product",
  SERVICE = "service",
  CUSTOMER = "customer",
  TREATMENT = "treatment",
  PACKAGE = "package",
}

export enum ItemType {
  PRODUCT = "product",
  SERVICE = "service",
  PACKAGE = "package",
  PACKAGE_ITEM = "package_item",
}
