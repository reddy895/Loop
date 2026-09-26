'use client';

import React from 'react';
import { CheckCircle2, XCircle, Loader2, Upload, AlertCircle } from 'lucide-react';
import type { UploadProgressEvent } from '@/lib/streamingCsvUploader';

interface UploadProgressProps {
  event: UploadProgressEvent | null;
  onCancel?: () => void;
  onDone?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ event, onCancel, onDone }) => {
  if (!event) return null;

  const isDone = event.phase === 'done';
  const isError = event.phase === 'error';
  const isActive = event.phase === 'uploading' || event.phase === 'parsing';

  return (
    <div className="w-full space-y-4 py-2 font-sans">
      {/* Header Icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`p-3.5 rounded-full border shadow-2xs ${
          isDone ? 'bg-neutral-900 border-neutral-900 text-white' :
          isError ? 'bg-white border-2 border-neutral-900 text-neutral-900' :
          'bg-neutral-100 border-neutral-300 text-neutral-900'
        }`}>
          {isDone ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : isError ? (
            <XCircle className="w-7 h-7" />
          ) : (
            <Loader2 className="w-7 h-7 animate-spin" />
          )}
        </div>

        <div>
          <h3 className="font-heading text-base font-bold text-neutral-900 tracking-tight">
            {isDone ? 'Import Complete' : isError ? 'Upload Failed' : 'Processing Dataset…'}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 font-sans max-w-xs">
            {isError ? event.errorMessage : event.message}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {!isError && (
        <div className="space-y-2">
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${event.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500">
            <span>{event.percentage}% complete</span>
            <span>{event.processedRows.toLocaleString()} / {event.totalRows.toLocaleString()} rows</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {(isActive || isDone) && event.totalRows > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-center">
            <p className="text-xs font-bold text-neutral-900 font-mono-numbers">{event.processedRows.toLocaleString()}</p>
            <p className="text-[10px] uppercase font-mono-numbers text-neutral-500 mt-0.5">Processed</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-900 rounded-lg p-2.5 text-center text-white">
            <p className="text-xs font-bold text-white font-mono-numbers">{event.importedCount.toLocaleString()}</p>
            <p className="text-[10px] uppercase font-mono-numbers text-neutral-300 mt-0.5">Imported</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-center">
            <p className="text-xs font-bold font-mono-numbers text-neutral-900">{event.failedCount.toLocaleString()}</p>
            <p className="text-[10px] uppercase font-mono-numbers text-neutral-500 mt-0.5">Failed</p>
          </div>
        </div>
      )}

      {/* Chunk info */}
      {isActive && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex items-start gap-2.5">
          <Upload className="w-4 h-4 text-neutral-700 mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-600 font-sans">
            Uploading in 500-row batches for memory efficiency. Large datasets are handled smoothly without browser lockups.
          </p>
        </div>
      )}

      {/* Done success message */}
      {isDone && event.importedCount > 0 && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-neutral-900 mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-800 font-sans">
            <strong>{event.importedCount.toLocaleString()} records</strong> successfully ingested. Dashboards and inbox are now updated with your dataset.
          </p>
        </div>
      )}

      {/* Failed warning */}
      {isDone && event.failedCount > 0 && (
        <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-neutral-700 mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-600 font-sans">
            {event.failedCount.toLocaleString()} rows could not be imported (missing required fields). All valid rows were saved.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-200">
        {isActive && onCancel && (
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel Upload
          </button>
        )}
        {isDone && onDone && (
          <button
            onClick={onDone}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-black border border-black rounded-lg hover:bg-neutral-800 transition-colors"
          >
            View Dashboard →
          </button>
        )}
        {isError && onCancel && (
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
