import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useForm, FormProvider } from "react-hook-form";
import { listAllRoleFeature } from "@ttm/api";

const basicUsageCode = `import { listAllRoleFeature } from "@/api/roleFeature";

export default function Example() {
  const { data, isLoading, isError, refetch } = listAllRoleFeature(
    ["role-features"], // Cache keys
    {
      per_page: 10,
      page: 1
    } // Query parameters
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading role features</div>;
}`;

const searchFilterCode = `import { listAllRoleFeature } from "@/api/roleFeature";
import { useState } from "react";

export default function Example() {

  const { data, isLoading } = listAllRoleFeature(
    ["role-features", searchTerm, selectedRole],
    {
      search: searchTerm,
      include: ["role.*", "feature.*"], 
      sort: ["-id"],  
      per_page: 20,
      page: 1
    }
  );
}`;

const objectStitchingCode = `import { listAllRoleFeature } from "@/api/roleFeature";

export default function Example() {
  const { data, isLoading } = listAllRoleFeature(
    ["role-features", "with-relations"],
    {
      "include": ["role.*", "feature.*"], 
      "sort": ["-id"],
      "per_page": 10
    },
    {
      role: "roles",
      feature: "features",
    }
  );
}`;

const complexFilteringCode = `import { listAllRoleFeature } from "@/api/roleFeature";

export default function Example() {
  const { data, isLoading } = listAllRoleFeature(
    ["role-features"],
    {
      search: "admin",
      filter: {
        is_active: true,
        role_type: "system"
      },
      in: {
        role_id: [1, 2], // Filter by specific role IDs
        feature_id: [3, 4, 5] // Filter by specific feature IDs
      },
      sort: ["-id"],
      include: ["role.*", "feature.*"],
      per_page: 25,
      page: 1
    },
    {
      role: "roles",
      feature: "features",
    }
  );
}`;

const apiStateProps = [
  {
    name: "isLoading",
    type: "boolean",
    description: "Indicates whether the API request is currently in progress",
  },
  {
    name: "isError",
    type: "boolean",
    description: "Indicates whether the API request failed with an error",
  },
  {
    name: "data",
    type: "object | undefined",
    description: "Contains the successful response data from the API",
  },
  {
    name: "error",
    type: "Error | null",
    description: "Contains error details if the request failed",
  },
  {
    name: "refetch",
    type: "function",
    description: "Function to manually trigger a new API request",
  },
  {
    name: "isFetching",
    type: "boolean",
    description:
      "True when any request is in progress (including background refetch)",
  },
];

const queryParams = [
  {
    name: "search",
    type: "string",
    description:
      "Full-text search across role-feature fields (role name, feature name, etc.)",
  },
  {
    name: "sort",
    type: "string[]",
    description:
      "Array of sort fields. Use minus (-) prefix for descending order.",
  },
  {
    name: "include",
    type: "string[]",
    description: "Include related data. Use .* for all fields of a relation.",
  },
  {
    name: "filter",
    type: "Record<string, string | string[]>",
    description: "Exact match filters for specific field values.",
  },
  {
    name: "in",
    type: "Record<string, string | string[]>",
    description: "Match field values against an array of options.",
  },
  {
    name: "per_page",
    type: "number",
    defaultValue: "1000",
    description: "Number of results per page.",
  },
  {
    name: "page",
    type: "number",
    defaultValue: "1",
    description: "Page number for pagination.",
  },
];

function RoleFeatureApiGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  const builderForm = useForm({
    defaultValues: {
      queryParams: '{\n   "include": ["role.*", "feature.*"]\n}',
      objectStitching: "{}",
    },
  });

  const [error, setError] = useState("");

  const [currentQueryParams, setCurrentQueryParams] = useState({
    per_page: 10,
    page: 1,
  });
  const [currentObjectStitching, setCurrentObjectStitching] = useState({});

  const { data, isLoading, isError } = listAllRoleFeature(
    ["role-features", currentQueryParams, currentObjectStitching],
    currentQueryParams,
    currentObjectStitching,
  );

  useEffect(() => {
    if (data) {
      console.log("listAllRoleFeature data:", data);
    }
  }, [data, currentObjectStitching, currentQueryParams]);

  const parseJSON = (jsonString: string, fieldName: string) => {
    try {
      const cleanedString = jsonString
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        .trim();

      return JSON.parse(cleanedString);
    } catch (e) {
      throw new Error(`Invalid JSON in ${fieldName}: ${e.message}`);
    }
  };

  const generateCode = () => {
    try {
      setError("");
      const values = builderForm.getValues();

      const queryParams = parseJSON(values.queryParams, "Query Parameters");
      const objectStitching = parseJSON(
        values.objectStitching,
        "Object Stitching",
      );

      setCurrentQueryParams(queryParams);
      setCurrentObjectStitching(objectStitching);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          Role Feature Query API Reference{" "}
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            listAllRoleFeature
          </code>{" "}
          function provides a powerful interface for querying role-feature
          relationships with search, filtering, sorting, pagination, and
          automatic relationship stitching capabilities.
        </p>
      </div>

      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Function Signature</h3>
        <pre className="text-blue-800 text-sm">
          {`listAllRoleFeature(
  type: string[],           // Cache keys
  params: QueryParams,      // Query parameters
  objectStitching: {}       // Relationship mapping
)`}
        </pre>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Simple role-feature listing with pagination. The function returns a
            React Query result with role-feature data and metadata including
            total counts and pagination information.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">Example Response:</div>
          <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
            {`{
  roleFeatures: [
    { id: 1, role_id: 1, feature_id: 3, created_at: "2024-01-15" },
    { id: 2, role_id: 2, feature_id: 5, created_at: "2024-01-16" }
  ],
  meta: {
    page: 1,
    per_page: 10,
    total_results: 2,
    total_pages: 1
  }
}`}
          </pre>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Search and Include"
        description={
          <>
            The{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              search
            </code>{" "}
            parameter performs full-text search across role-feature fields,
            while{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              include
            </code>{" "}
            allows you to specify related data to fetch. Use{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">.*</code>{" "}
            to include all fields of a relation, or specify individual fields.
          </>
        }
        codeId="search"
        code={searchFilterCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      ></ExampleSection>

      <ExampleSection
        title="Object Stitching"
        description={
          <>
            Automatically resolve foreign key relationships by mapping IDs to
            included objects. The{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              objectStitching
            </code>{" "}
            parameter defines which foreign keys should be replaced with full
            objects from the included data.
          </>
        }
        codeId="stitching"
        code={objectStitchingCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-sm font-medium mb-2">Before Stitching:</div>
          <pre className="text-xs bg-white p-2 rounded mb-3">
            {`roleFeature: { id: 1, role_id: 2, feature_id: 5 } // IDs only`}
          </pre>
          <div className="text-sm font-medium mb-2">After Stitching:</div>
          <pre className="text-xs bg-white p-2 rounded">
            {`roleFeature: { 
  id: 1, 
  role: { id: 2, name: "Admin", code: "admin" },
  feature: { id: 5, name: "User Management", code: "user_mgmt" }
}`}
          </pre>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Complex Filtering"
        description={
          <>
            Demonstrate advanced filtering with multiple conditions, array
            matching using{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">in</code>,
            and multiple sort fields with directional control.
          </>
        }
        codeId="complex"
        code={complexFilteringCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span>filter</span>
            <p className="text-xs">Exact matches</p>
          </div>
          <div>
            <span>in</span>
            <p className="text-xs">Array contains</p>
          </div>
          <div>
            <span>sort</span>
            <p className="text-xs">Multiple fields</p>
          </div>
        </div>
      </ExampleSection>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Query Parameters Reference</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Available parameters for filtering, searching, sorting, and including
          related data in your listAllRoleFeature queries.
        </p>
        <PropsTable props={queryParams} />
      </div>

      <ExampleSection
        title="Interactive Builder"
        description={
          <>
            Build your own{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              listAllRoleFeature
            </code>{" "}
            function call by configuring parameters and object stitching.
            Generate ready-to-use code for your application.
          </>
        }
        codeId="builder"
        code=""
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <FormProvider {...builderForm}>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl">Query Builder</CardTitle>
              <Button onClick={generateCode} size="lg" className="px-8">
                Submit
              </Button>
            </CardHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Query Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="queryParams"
                      formLabel=""
                      control={builderForm.control}
                      placeholder={`{"search": "admin"}`}
                      size="lg"
                      className="font-mono text-sm"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Object Stitching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="objectStitching"
                      formLabel=""
                      control={builderForm.control}
                      placeholder={`{"role": "roles", "feature": "features"}`}
                      size="lg"
                      className="font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800 font-semibold">Error:</div>
                  <div className="text-red-700 text-sm mt-1">{error}</div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Data Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading && <div>Loading...</div>}
                  {isError && (
                    <div className="text-red-600">Error loading data</div>
                  )}
                  {data && (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto max-h-96">
                      <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Card>
        </FormProvider>
      </ExampleSection>

      <div className="space-y-8">
        <div>
          <PropsTable title="API State Props Reference" props={apiStateProps} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/query-api-reference",
)({
  component: RoleFeatureApiGuidePage,
});
