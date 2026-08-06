/**
 * @file csvUtils.ts
 * @description Utilities for converting JSON arrays into CSV string representations.
 */

/**
 * Converts an array of objects into a formatted CSV string representation.
 * @param data Array of records
 */
export const convertObjectsToCsv = <T extends Record<string, unknown>>(data: T[]): string => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const headerLine = headers.join(",");

  const rowLines = data.map((row) => {
    return headers
      .map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(",");
  });

  return [headerLine, ...rowLines].join("\n");
};

/**
 * Parses a CSV raw string into an array of header-mapped objects.
 * Handles quoted fields, commas, and line breaks.
 */
export const parseCsvString = (csvContent: string): Record<string, string>[] => {
  if (!csvContent || !csvContent.trim()) return [];

  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.every((v) => !v)) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    records.push(row);
  }

  return records;
};

/**
 * Validates a CSV row for required feedback fields.
 */
export const validateCsvRow = (
  row: Record<string, string>,
  rowIndex: number
): { valid: boolean; error?: { row: number; message: string; field?: string }; data?: { content: string; channel: string; customerLabel: string; source?: string; sentiment?: string } } => {
  const content = row["content"] || row["feedback"] || row["text"] || row["message"];
  const channel = row["channel"] || row["source_channel"] || row["platform"] || "CSV Import";
  const customerLabel = row["customerlabel"] || row["customer"] || row["user"] || row["segment"] || "Imported Customer";
  const source = row["source"] || "csv_batch";
  const rawSentiment = (row["sentiment"] || "").toUpperCase();
  const sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(rawSentiment) ? rawSentiment : undefined;

  if (!content || !content.trim()) {
    return {
      valid: false,
      error: { row: rowIndex, message: "Field 'content' (or feedback text) is required.", field: "content" },
    };
  }

  return {
    valid: true,
    data: {
      content: content.trim(),
      channel: channel.trim(),
      customerLabel: customerLabel.trim(),
      source: source.trim(),
      sentiment,
    },
  };
};

