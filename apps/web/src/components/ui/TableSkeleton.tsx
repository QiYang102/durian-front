import { FunctionComponent } from "react";
import { Skeleton } from "./Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  headerLabels?: string[];
  className?: string;
  cellHeight?: string;
}

const TableSkeleton: FunctionComponent<TableSkeletonProps> = ({
  rows = 5,
  columns = 3,
  showHeader = true,
  headerLabels = [],
  className = "",
  cellHeight = "h-4",
}) => {
  // Generate header labels if not provided
  const headers =
    headerLabels.length > 0
      ? headerLabels
      : Array.from({ length: columns }, (_, index) => `Column ${index + 1}`);

  return (
    <Table className={className}>
      {showHeader && (
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                {headerLabels.length > 0 ? (
                  headers[index] || ""
                ) : (
                  <Skeleton className="h-4 w-20" />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className={cellHeight} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
