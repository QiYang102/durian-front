import { Season } from "@ttm/api/types/models/season-summary";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Text } from "@/components/ui/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export function TotalVerified({ season }: { season: Season | undefined }) {
  const verifiedData = season?.report_data.total_verified_by_users;

  if (!verifiedData || verifiedData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Verified Task</CardTitle>
        </CardHeader>
        <CardContent className="flex h-96 items-center justify-center text-gray-500">
          <Text>No data available</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Verified Task</CardTitle>
      </CardHeader>
      <CardContent className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold p-4 text-left min-w-[120px]">
                  ID
                </TableHead>
                <TableHead className="font-semibold p-4 text-left min-w-[200px]">
                  Fullname
                </TableHead>
                <TableHead className="font-semibold p-4 text-left min-w-[150px]">
                  Total Verified
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifiedData.map((item: any) => {
                return (
                  <TableRow key={item.user_id}>
                    <TableCell className="text-left">
                      {item.user_id || "-"}
                    </TableCell>
                    <TableCell className="text-left">
                      {item.fullname || "-"}
                    </TableCell>
                    <TableCell className="text-left">
                      {item.total_verified || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
