import { FunctionComponent } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

interface TableColumn {
  header: string;
  className?: string;
}

interface TableLoadingSkeletonProps {
  columns: TableColumn[];
  rows?: number;
  skeletonHeight?: string;
}

const TableLoadingSkeleton: FunctionComponent<TableLoadingSkeletonProps> = ({
  columns,
  rows = 10,
  skeletonHeight = "h-4",
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((_, colIndex) => (
              <TableCell
                key={`skeleton-${rowIndex}-${colIndex}`}
                className="text-left"
              >
                <Skeleton className={`${skeletonHeight} w-full`} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLoadingSkeleton;
