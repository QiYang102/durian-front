import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Button } from "@/components/ui/Button";
import TableSkeleton from "@/components/ui/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface User {
  id: number;
  name: string;
  email: string;
}

const basicUsageCode = `import TableSkeleton from "@/components/ui/TableSkeleton";

export default function Example() {
  return (
    <TableSkeleton />
  );
}`;

const customDimensionsCode = `import TableSkeleton from "@/components/ui/TableSkeleton";

export default function Example() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Small Table (3x3)</h3>
        <TableSkeleton rows={3} columns={3} />
      </div>
    </div>
  );
}`;

const withHeaderLabelsCode = `import TableSkeleton from "@/components/ui/TableSkeleton";

export default function Example() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">User Management</h3>
        <TableSkeleton 
          rows={5}
          columns={5}
          headerLabels={["Name", "Email", "Role", "Status", "Actions"]}
        />
      </div>
    </div>
  );
}`;

const realWorldCode = `import TableSkeleton from "@/components/ui/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useEffect } from "react";

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com"},
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export default function Example() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    setLoading(true);
    setUsers([]);

    new Promise((resolve) => setTimeout(resolve, 2000))
      .then(() => {
        setUsers(mockUsers);
        setLoading(false);
      })
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button onClick={loadUsers} disabled={loading}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TableSkeleton 
            rows={2}
            columns={2}
            headerLabels={["Name", "Email"]}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}`;

const props = [
  {
    name: "rows",
    type: "number",
    defaultValue: "5",
    description: "Number of skeleton rows to display",
  },
  {
    name: "columns",
    type: "number",
    defaultValue: "3",
    description: "Number of columns in the table",
  },
  {
    name: "showHeader",
    type: "boolean",
    defaultValue: "true",
    description: "Whether to show the table header",
  },
  {
    name: "headerLabels",
    type: "string[]",
    defaultValue: "[]",
    description:
      "Array of header labels. If empty, skeleton placeholders are used",
  },
  {
    name: "cellHeight",
    type: "string",
    defaultValue: '"h-4"',
    description: "Tailwind height class for skeleton cells ",
  },
];

function TableSkeletonGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
    },
  ];

  const loadUsers = () => {
    setLoading(true);
    setUsers([]);

    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      setUsers(mockUsers);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          TableSkeleton
        </h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            TableSkeleton
          </code>{" "}
          component provides animated skeleton placeholders for table data while
          content is loading. It maintains table structure with customizable
          rows, columns, headers, and cell heights.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Simple table skeleton with default settings: 5 rows, 3 columns, with
            header. The skeleton automatically animates to indicate loading
            state.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-gray-100"
      >
        <TableSkeleton />
      </ExampleSection>

      <ExampleSection
        title="Custom Dimensions"
        description={
          <>
            Customize the table size with{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              rows
            </code>{" "}
            and{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              columns
            </code>{" "}
            props to match your expected data structure.
          </>
        }
        codeId="dimensions"
        code={customDimensionsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-gray-100"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Small Table (3x3)</h3>
            <TableSkeleton rows={3} columns={3} />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        title="With Header Labels"
        description={
          <>
            Provide actual header labels using{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              headerLabels
            </code>{" "}
            for better user experience. This helps users understand what data
            will be displayed.
          </>
        }
        codeId="headers"
        code={withHeaderLabelsCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-gray-100"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">User Management</h3>
            <TableSkeleton
              rows={5}
              columns={5}
              headerLabels={["Name", "Email", "Role", "Status", "Actions"]}
            />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Real-world Example"
        description={
          <>
            Complete example showing TableSkeleton in a data management
            interface. The skeleton maintains the exact structure of the actual
            table for seamless loading transitions.
          </>
        }
        codeId="real-world"
        code={realWorldCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
        containerColor="bg-gray-100"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button onClick={loadUsers} disabled={loading}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton
                rows={2}
                columns={2}
                headerLabels={["Name", "Email"]}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute(
  "/_sandbox/developer-guide/table-skeleton",
)({
  component: TableSkeletonGuidePage,
});
