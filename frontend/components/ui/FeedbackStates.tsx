import React from 'react';
import { AlertCircle, Inbox, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-neutral-100/80 rounded-lg border border-neutral-200" />
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}> = ({
  title = 'No Feedback Found',
  description = 'No customer feedback records match your current filter parameters or search query.',
  onAction,
  actionText = 'Clear Filters'
}) => {
  return (
    <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
      <div className="p-3.5 bg-neutral-100 rounded-full text-neutral-900 border border-neutral-200 mb-3.5">
        <Inbox className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-base sm:text-lg font-bold text-neutral-900">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 font-sans max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = 'An unexpected error occurred while fetching feedback analytics.',
  onRetry
}) => {
  return (
    <div className="loop-card p-5 sm:p-6 border-l-4 border-l-black flex items-start gap-4">
      <AlertCircle className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-heading font-bold text-sm text-neutral-900">
          System Notice
        </h4>
        <p className="text-xs text-neutral-600 font-sans mt-1 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            className="mt-3.5"
          >
            Retry Connection
          </Button>
        )}
      </div>
    </div>
  );
};

export const CSVRetrieveCard: React.FC<{ onRetrieveClick: () => void; title?: string; description?: string }> = ({
  onRetrieveClick,
  title = 'Retrieve CSV Feedback Dataset',
  description = 'Fetch batch customer feedback records from CSV to generate real-time AI sentiment analytics and dashboards.'
}) => {
  return (
    <Card variant="panel" className="border-dashed border-2 border-neutral-300 hover:border-black transition-all bg-white">
      <div className="flex flex-col items-center text-center py-6 sm:py-8">
        <div className="p-3.5 bg-neutral-100 rounded-full text-neutral-900 border border-neutral-200 mb-3 shadow-2xs">
          <FileSpreadsheet className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-base font-bold text-neutral-900">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 font-sans max-w-md mt-1 mb-5 leading-relaxed">
          {description}
        </p>
        <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={onRetrieveClick}>
          Retrieve CSV & Generate Dashboards
        </Button>
      </div>
    </Card>
  );
};

export const CSVUploadCard = CSVRetrieveCard;
