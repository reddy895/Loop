'use client';

import React from 'react';
import { CheckCircle2, XCircle, Loader2, Upload, AlertTriangle } from 'lucide-react';
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
    <div className="w-full space-y-4 py-2">
      {/* Header Icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`p-4 rounded-full border shadow-sm ${
          isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
          isError ? 'bg-red-50 border-red-200 text-red-600' :
          'bg-blue-50 border-blue-200 text-blue-600'
        }`}>
          {isDone ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : isError ? (
            <XCircle className="w-8 h-8" />
          ) : (
            <Loader2 className="w-8 h-8 animate-spin" />
          )}
        </div>

        <div>
          <h3 className="font-heading text-base font-bold text-neutral-900">
            {isDone ? 'Import Complete!' : isError ? 'Upload Failed' : 'Uploading Large Dataset…'}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 font-sans max-w-xs">
            {isError ? event.errorMessage : event.message}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {!isError && (
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${event.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500">
            <span>{event.percentage}% complete</span>
            <span>{event.processedRows.toLocaleString()} / {event.totalRows.toLocaleString()} rows</span>
          </div>
        </div>
      )}

      {/* Stats Grid — shown during upload and after done */}
      {(isActive || isDone) && event.totalRows > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-center">
            <p className="text-xs font-bold text-neutral-900 font-mono-numbers">{event.processedRows.toLocaleString()}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Processed</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
            <p className="text-xs font-bold text-emerald-700 font-mono-numbers">{event.importedCount.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">Imported</p>
          </div>
          <div className={`border rounded-lg p-2.5 text-center ${event.failedCount > 0 ? 'bg-red-50 border-red-200' : 'bg-neutral-50 border-neutral-200'}`}>
            <p className={`text-xs font-bold font-mono-numbers ${event.failedCount > 0 ? 'text-red-700' : 'text-neutral-400'}`}>{event.failedCount.toLocaleString()}</p>
            <p className={`text-[10px] mt-0.5 ${event.failedCount > 0 ? 'text-red-600' : 'text-neutral-400'}`}>Failed</p>
          </div>
        </div>
      )}

      {/* Chunk info */}
      {isActive && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2.5">
          <Upload className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-blue-700 font-sans">
            Uploading in 500-row batches for memory efficiency. Large datasets (lakhs of rows) are handled without freezing your browser.
          </p>
        </div>
      )}

      {/* Done success message */}
      {isDone && event.importedCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-emerald-700 font-sans">
            <strong>{event.importedCount.toLocaleString()} records</strong> stored in the database. Dashboards and inbox will now reflect your dataset with server-side filtering and pagination.
          </p>
        </div>
      )}

      {/* Failed warning */}
      {isDone && event.failedCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-700 font-sans">
            {event.failedCount.toLocaleString()} rows could not be imported — they may be missing required fields (feedback text or channel). All valid rows were saved.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-neutral-200">
        {isActive && onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel Upload
          </button>
        )}
        {isDone && onDone && (
          <button
            onClick={onDone}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 border border-emerald-700 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            View Dashboard →
          </button>
        )}
        {isError && onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
