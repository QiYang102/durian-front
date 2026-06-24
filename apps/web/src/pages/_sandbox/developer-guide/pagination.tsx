import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ExampleSection } from "@/components/ui/ExampleSection";
import { PropsTable } from "@/components/ui/PropsTable";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

const basicUsageCode = `import { Pagination } from "@/components/pagination";
import { useState } from "react";

export default function Example() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}`;

const customStyledCode = `import { Pagination } from "@/components/pagination";
import { useState } from "react";

export default function Example() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Custom Container</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          containerClassName="bg-gray-50 p-4 rounded-lg border bg-white "
        />
      </div>
    </div>
  );
}`;

const dataTableCode = `import { Pagination } from "@/components/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useMemo } from "react";

// Mock data
const generateMockData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: \`User \${i + 1}\`,
    email: \`user\${i + 1}@example.com\`,
    role: ['Admin', 'User', 'Editor'][i % 3],
    status: i % 4 === 0 ? 'Inactive' : 'Active'
  }));
};

export default function Example() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const allData = generateMockData(47);
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  }, [currentPage, allData, itemsPerPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Directory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
       <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {currentData.map((user) => (
                <TableRow key={user.id}>
                <TableCell className="font-medium ">{user.name}</TableCell>
                <TableCell className="text-gray-600">
                    {user.email}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}`;

const props = [
  {
    name: "currentPage",
    type: "number",
    description: "Current active page number",
  },
  {
    name: "totalPages",
    type: "number",
    description: "Total number of pages available",
  },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    description: "Callback function called when page changes",
  },
  {
    name: "containerClassName",
    type: "string",
    description: "Additional CSS classes to apply to the pagination container",
  },
];

function PaginationGuidePage() {
  const [copiedCode, setCopiedCode] = useState("");

  const [basicPage, setBasicPage] = useState(1);
  const [styledPage, setStyledPage] = useState(1);
  const [tablePage, setTablePage] = useState(1);

  const generateMockData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ["Admin", "User", "Editor"][i % 3],
      status: i % 4 === 0 ? "Inactive" : "Active",
    }));
  };

  const itemsPerPage = 5;
  const allData = generateMockData(47);
  const totalTablePages = Math.ceil(allData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (tablePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  }, [tablePage, allData, itemsPerPage]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Pagination</h1>
        <p className="text-lg text-slate-600">
          The{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
            Pagination
          </code>{" "}
          component provides intuitive page navigation with smart page grouping,
          skip buttons for large datasets, and automatic boundary handling.
        </p>
      </div>

      <ExampleSection
        title="Basic Usage"
        description={
          <>
            Standard pagination with 10 pages. The component shows up to 4 page
            numbers with previous/next navigation. Current page is highlighted
            with a border and background.
          </>
        }
        codeId="basic"
        code={basicUsageCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Page {basicPage} of 10</p>
          </div>
          <Pagination
            currentPage={basicPage}
            totalPages={10}
            onPageChange={setBasicPage}
          />
        </div>
      </ExampleSection>

      <ExampleSection
        title="Custom Styling"
        description={
          <>
            Customize the pagination appearance using{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
              containerClassName
            </code>{" "}
            prop. Add backgrounds, borders, padding, or other styling.
          </>
        }
        codeId="styling"
        code={customStyledCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Custom Container</h3>
            <Pagination
              currentPage={styledPage}
              totalPages={15}
              onPageChange={setStyledPage}
              containerClassName="bg-gray-50 p-4 rounded-lg border bg-white"
            />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        title="Data Table Integration"
        description={
          <>
            Real-world example showing pagination with a data table. The
            pagination controls which subset of data is displayed, with
            automatic page calculations and data slicing.
          </>
        }
        codeId="data-table"
        code={dataTableCode}
        copiedCode={copiedCode}
        setCopiedCode={setCopiedCode}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium ">{user.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Page {tablePage} of {totalTablePages}
              </p>
              <Pagination
                currentPage={tablePage}
                totalPages={totalTablePages}
                onPageChange={setTablePage}
              />
            </div>
          </CardContent>
        </Card>
      </ExampleSection>

      <PropsTable props={props} />
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/developer-guide/pagination")({
  component: PaginationGuidePage,
});
