'use client';

/**
 * @file streamingCsvUploader.ts
 * @description Handles large CSV uploads by chunking the file into row batches
 * and sending each batch to the backend separately. Reports progress via callback.
 * This prevents browser OOM on files with lakhs (100,000+) of rows.
 */

export interface UploadProgressEvent {
  phase: 'parsing' | 'uploading' | 'done' | 'error';
  processedRows: number;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  percentage: number;
  message: string;
  errorMessage?: string;
}

export interface UploadResult {
  importedCount: number;
  failedCount: number;
  totalProcessed: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const CHUNK_SIZE = 500; // rows per batch — keeps each request well under 1MB

/**
 * Parse CSV text into header + rows arrays efficiently.
 * Handles quoted fields with commas and embedded newlines.
 */
function parseCsvLines(text: string): { header: string; rows: string[] } {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      if (current.trim()) lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return { header: lines[0] || '', rows: [] };
  return { header: lines[0], rows: lines.slice(1) };
}

/**
 * Upload a CSV File object to the backend in chunks.
 * Calls onProgress repeatedly with progress events.
 * Returns a summary result when complete.
 */
export async function uploadCsvInChunks(
  file: File,
  authToken: string,
  onProgress: (event: UploadProgressEvent) => void,
  signal?: AbortSignal
): Promise<UploadResult> {
  onProgress({ phase: 'parsing', processedRows: 0, totalRows: 0, importedCount: 0, failedCount: 0, percentage: 0, message: 'Reading file…' });

  let text: string;
  try {
    text = await file.text();
  } catch {
    onProgress({ phase: 'error', processedRows: 0, totalRows: 0, importedCount: 0, failedCount: 0, percentage: 0, message: 'Failed to read file', errorMessage: 'Could not read the CSV file.' });
    throw new Error('Could not read file');
  }

  const { header, rows } = parseCsvLines(text);
  const totalRows = rows.length;

  if (totalRows === 0) {
    onProgress({ phase: 'error', processedRows: 0, totalRows: 0, importedCount: 0, failedCount: 0, percentage: 0, message: 'Empty file', errorMessage: 'CSV file has no data rows.' });
    throw new Error('Empty CSV');
  }

  onProgress({ phase: 'uploading', processedRows: 0, totalRows, importedCount: 0, failedCount: 0, percentage: 0, message: `Detected ${totalRows.toLocaleString()} rows. Starting upload…` });

  let totalImported = 0;
  let totalFailed = 0;
  let processedRows = 0;

  const totalChunks = Math.ceil(rows.length / CHUNK_SIZE);

  for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
    if (signal?.aborted) {
      throw new DOMException('Upload cancelled by user', 'AbortError');
    }

    const chunkRows = rows.slice(chunkIdx * CHUNK_SIZE, (chunkIdx + 1) * CHUNK_SIZE);
    const csvChunk = [header, ...chunkRows].join('\n');

    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ csvContent: csvChunk }),
        signal,
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        totalImported += data.importedCount || chunkRows.length;
        totalFailed += data.failedCount || 0;
      } else {
        totalFailed += chunkRows.length;
      }
    } catch (fetchErr) {
      if ((fetchErr as Error).name === 'AbortError') throw fetchErr;
      totalFailed += chunkRows.length;
    }

    processedRows += chunkRows.length;
    const percentage = Math.round((processedRows / totalRows) * 100);
    const estimatedRemaining = totalChunks - chunkIdx - 1;
    const message = `Uploaded ${processedRows.toLocaleString()} / ${totalRows.toLocaleString()} rows (batch ${chunkIdx + 1} of ${totalChunks})`;

    onProgress({ phase: 'uploading', processedRows, totalRows, importedCount: totalImported, failedCount: totalFailed, percentage, message });
  }

  onProgress({
    phase: 'done',
    processedRows: totalRows,
    totalRows,
    importedCount: totalImported,
    failedCount: totalFailed,
    percentage: 100,
    message: `Import complete! ${totalImported.toLocaleString()} records stored.`,
  });

  return { importedCount: totalImported, failedCount: totalFailed, totalProcessed: totalRows };
}

/**
 * Small preset dataset loader — used for demo datasets (enterprise/appstore/zendesk).
 * These are bundled as JS, so no network required.
 */
export function isLargeFile(file: File): boolean {
  // Threshold: > 500KB or > ~5000 rows estimated → use streaming upload
  return file.size > 512 * 1024;
}
