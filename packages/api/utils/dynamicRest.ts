import { QueryParams } from "../types";

export function buildQueryString(params: QueryParams): string {
  const queryParts: string[] = [];

  if (params.search) {
    queryParts.push(`search=${params.search}`);
  }

  if (params.sort) {
    for (const sortParam of params.sort) {
      queryParts.push(`sort[]=${encodeURI(sortParam)}`);
    }
  }

  if (params.include) {
    for (const includeParam of params.include) {
      queryParts.push(`include[]=${encodeURI(includeParam)}`);
    }
  }

  if (params.filter) {
    for (const [key, filterValue] of Object.entries(params.filter)) {
      if (Array.isArray(filterValue)) {
        for (const value of filterValue) {
          if (is_valid(value)) {
            queryParts.push(`filter{${key}}[]=${encodeURI(value)}`);
          }
        }
      } else {
        if (is_valid(filterValue)) {
          queryParts.push(`filter{${key}}=${encodeURI(filterValue)}`);
        }
      }
    }
  }

  if (params.in) {
    for (const [key, inValue] of Object.entries(params.in)) {
      if (Array.isArray(inValue)) {
        for (const value of inValue) {
          if (is_valid(value)) {
            queryParts.push(`filter{${key}.in}=${encodeURI(value)}`);
          }
        }
      }
    }
  }

  if (params.per_page) {
    queryParts.push(`per_page=${encodeURI(params.per_page.toString())}`);
  }

  if (params.page) {
    queryParts.push(`page=${encodeURI(params.page.toString())}`);
  }

  if (params.bucket) {
    queryParts.push(`bucket=${encodeURI(params.bucket.toString())}`);
  }

  if (params.usage) {
    queryParts.push(`usage=${encodeURI(params.usage.toString())}`);
  }

  if (params.params) {
    for (const [key, value] of Object.entries(params.params)) {
      if (is_valid(value)) {
        queryParts.push(`${key}=${encodeURI(value)}`);
      }
    }
  }

  if (params.tags) {
    queryParts.push(`tags=${encodeURI(params.tags.toString())}`);
  }

  return queryParts.join("&");
}

type Entity = Record<string, any>;
type StitchingMap = Record<string, string>;

export function combineIncludeData(
  data: Record<string, any>,
  objectStitching: Record<string, string>,
): Record<string, any> {
  if (!data || typeof data !== "object") return data;

  // Create maps of included entities
  const includedEntityMaps: Record<string, Map<string | number, any>> = {};

  // Process included entities into maps
  for (const key in data) {
    if (key !== "meta" && Array.isArray(data[key])) {
      includedEntityMaps[key] = new Map(data[key].map((e) => [e.id, e]));
    }
  }

  // Handle case where we have a single entity (e.g., booking) along with included data
  for (const mainEntityKey in data) {
    if (mainEntityKey === "meta") continue;

    // Check if the current key is an array of entities
    if (Array.isArray(data[mainEntityKey])) {
      // Handle array of entities (like in getBookingListing)
      const mainEntities = data[mainEntityKey];

      for (let entity of mainEntities) {
        stitchEntityReferences(entity, objectStitching, includedEntityMaps);
      }
    } else if (
      typeof data[mainEntityKey] === "object" &&
      data[mainEntityKey] !== null
    ) {
      // Handle single entity (like in getSingleBooking)
      stitchEntityReferences(
        data[mainEntityKey],
        objectStitching,
        includedEntityMaps,
      );
    }
  }

  return data;
}

// Helper function to stitch entity references
function stitchEntityReferences(
  entity: Record<string, any>,
  objectStitching: Record<string, string>,
  includedEntityMaps: Record<string, Map<string | number, any>>,
): void {
  for (const [key, value] of Object.entries(objectStitching)) {
    if (value in includedEntityMaps) {
      const refId = entity[key];
      if (refId) {
        entity[key] = includedEntityMaps[value].get(refId) || null;
      }
    }
  }
}

// a simple fix to cater/filter invalid params
function is_valid(value: any) {
  if (value === undefined) {
    return false;
  }

  const valueType = typeof value;
  switch (valueType) {
    case "string":
      return value.length > 0;
    case "number":
    case "boolean":
      return true;
    case "object":
      return Array.isArray(value);
    default:
      console.error("unknown type from dynamicRest.ts:", valueType, value);
      return false;
  }
}
