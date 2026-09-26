import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-3.5 border-t border-neutral-200 font-sans text-xs text-neutral-600">
      <div>
        Showing <span className="font-semibold font-mono-numbers text-neutral-900">{startItem}</span> to{' '}
        <span className="font-semibold font-mono-numbers text-neutral-900">{endItem}</span> of{' '}
        <span className="font-semibold font-mono-numbers text-neutral-900">{totalItems}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>

        <span className="px-3 py-1 bg-neutral-100 rounded-md font-semibold font-mono-numbers text-neutral-900 border border-neutral-200 text-xs">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
