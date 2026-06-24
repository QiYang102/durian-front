import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Text } from "@/components/ui/Text";

type PropItem = {
  name: string;
  type: string;
  example?: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
};

export function PropsTable({
  title = "Props",
  props,
}: {
  title?: string;
  props: PropItem[];
}) {
  const hasExamples = props.some((prop) => prop.example);

  return (
    <div className="mb-12">
      <div className="mb-4">
        <Text className="text-2xl font-bold text-slate-800">{title}</Text>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50">
                <TableHead className="p-4 font-medium">Name</TableHead>
                <TableHead className="p-4 font-medium">Type</TableHead>
                {hasExamples && (
                  <TableHead className="p-4 font-medium">Example</TableHead>
                )}
                <TableHead className="p-4 font-medium">Default</TableHead>
                <TableHead className="p-4 font-medium">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((prop) => (
                <TableRow key={prop.name} className="border-b">
                  <TableCell className="p-4">
                    <span className="font-medium text-info-500">
                      {prop.name}
                      {prop.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-gray-700 font-mono">{prop.type}</span>
                  </TableCell>
                  {hasExamples && (
                    <TableCell className="p-4">
                      {prop.example ? (
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                          {prop.example}
                        </code>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="p-4">
                    <span className="font-medium">
                      {prop.defaultValue ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">{prop.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
