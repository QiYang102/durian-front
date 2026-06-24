import React, { useEffect } from "react";

import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: any;
  totalPages: any;
  onPageChange: (page: number) => void;
  containerClassName?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  containerClassName,
}) => {
  const visiblePages = 4;

  const getPaginationGroup = () => {
    let start = currentPage - Math.floor(visiblePages / 3);
    start = Math.max(start, 1);
    let end = start + visiblePages - 1;
    end = Math.min(end, totalPages);

    // Adjust the start if we're at the end
    if (end === totalPages) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const handlePageClick = (page: number) => {
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    onPageChange(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageClick(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div
      className={cn(
        "my-2 flex-row items-center justify-center py-0",
        containerClassName,
      )}
    >
      {totalPages > visiblePages && currentPage !== 1 ? (
        <Button
          onClick={() => handlePageClick(currentPage - (visiblePages - 1))}
          disabled={currentPage === 1}
          className="items-center justify-center rounded-full px-2"
          variant="ghost"
        >
          &nbsp;
          <SkipBack className="h-4 w-4 text-slate-500" />
        </Button>
      ) : (
        <div />
      )}
      {currentPage !== 1 ? (
        <Button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="items-center justify-center rounded-full px-2"
          variant="ghost"
        >
          &nbsp;
          <ChevronLeft className="h-4 w-4 text-slate-500" />
        </Button>
      ) : (
        <div />
      )}
      {getPaginationGroup().map((item, index) => (
        <Button
          key={index}
          onClick={() => handlePageClick(item)}
          className={cn(
            "m-0.5 h-10 w-10 items-center justify-center rounded-full",
            currentPage === item && "border border-slate-500 bg-slate-50",
          )}
          variant="ghost"
        >
          <p
            className={cn(
              "text-slate-500",
              currentPage === item && "text-slate-500",
            )}
          >
            {item}
          </p>
        </Button>
      ))}
      {currentPage !== totalPages ? (
        <Button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="items-center justify-center rounded-full px-2"
          variant="ghost"
        >
          &nbsp;
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </Button>
      ) : (
        <div />
      )}
      {totalPages > visiblePages && currentPage !== totalPages ? (
        <Button
          onClick={() => handlePageClick(currentPage + (visiblePages - 1))}
          disabled={currentPage === totalPages}
          className="items-center justify-center rounded-full px-2"
          variant="ghost"
        >
          &nbsp;
          <SkipForward className="h-4 w-4 text-slate-500" />
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
};
