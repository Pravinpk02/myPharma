import type { BulkOrderRow, InventoryProduct } from '../types';

const VALID_SUPPLIERS = ['Sun Pharma', 'Cipla Ltd', 'Abbott India', "Dr. Reddy's"];
const VALID_CATEGORIES = ['Antibiotics', 'Vitamins', 'Analgesics', 'Cardiology', 'Diabetes', 'Supplements'];

/**
 * Attempt to normalize a date string from various common formats to YYYY-MM-DD.
 * Supported formats:
 *   - YYYY-MM-DD (already correct)
 *   - DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
 *   - DD-MM-YY, DD/MM/YY, DD.MM.YY (assumes 20xx century)
 *   - MM-DD-YYYY, MM/DD/YYYY (US format — only used when day > 12 makes DD-MM impossible)
 *   - YYYY/MM/DD
 * Returns the normalised YYYY-MM-DD string, or the original string if parsing fails.
 */
export function normalizeDateString(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Separator: -, /, .
  const parts = trimmed.split(/[-/.]/);

  if (parts.length === 3) {
    const [a, b, c] = parts.map((p) => p.trim());

    // YYYY/MM/DD or YYYY.MM.DD
    if (a.length === 4) {
      const y = parseInt(a, 10);
      const m = parseInt(b, 10);
      const d = parseInt(c, 10);
      if (y > 0 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return `${a}-${b.padStart(2, '0')}-${c.padStart(2, '0')}`;
      }
    }

    // DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    if (c.length === 4) {
      const d = parseInt(a, 10);
      const m = parseInt(b, 10);
      const y = parseInt(c, 10);

      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y > 0) {
        return `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
      }

      if (m > 12 && d >= 1 && d <= 12) {
        return `${c}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`;
      }

      if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
        return `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
      }
    }

    // DD-MM-YY or DD/MM/YY or DD.MM.YY (2-digit year)
    if (c.length === 2) {
      const d = parseInt(a, 10);
      const m = parseInt(b, 10);
      const yy = parseInt(c, 10);
      const fullYear = yy >= 0 && yy <= 99 ? 2000 + yy : yy;

      if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
        return `${fullYear}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
      }
    }
  }

  return trimmed;
}

/**
 * Parse a CSV text string into an array of BulkOrderRow objects.
 * Expected CSV header columns (matching Add Product form):
 *   name, category, batch, sku, units, unit_price, expiry_date, supplier, stock
 */
export function parseCSV(text: string): BulkOrderRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header row — normalise header names
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const rows: BulkOrderRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    const getCol = (key: string): string => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? (values[idx] ?? '').trim() : '';
    };

    // Normalize the expiry date from whatever format the CSV uses → YYYY-MM-DD
    const rawDate = getCol('expiry_date');
    const normalizedDate = normalizeDateString(rawDate);

    rows.push({
      rowIndex: i,
      name: getCol('name') || getCol('product_name'),
      category: getCol('category'),
      batch: getCol('batch') || getCol('batch_number'),
      sku: getCol('sku') || getCol('sku_code'),
      units: getCol('units') || getCol('initial_units'),
      unitPrice: getCol('unit_price') || getCol('price'),
      expiryDate: normalizedDate,
      supplier: getCol('supplier'),
      stock: getCol('stock') || getCol('stock_level') || '50',
      status: 'valid',
      errors: {},
    });
  }

  return rows;
}

/**
 * Handle quoted CSV fields correctly.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * Validate a single BulkOrderRow against the same rules as the Add Product form.
 * Returns the row with errors populated and status set.
 */
export function validateCSVRow(row: BulkOrderRow, _inventory: InventoryProduct[]): BulkOrderRow {
  const errors: Record<string, string> = {};

  // Validate name (required)
  if (!row.name.trim()) {
    errors.name = 'Product name is required';
  }

  // Validate category (required, must be valid)
  if (!row.category.trim()) {
    errors.category = 'Category is required';
  } else if (!VALID_CATEGORIES.includes(row.category)) {
    errors.category = `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }

  // Validate batch (required)
  if (!row.batch.trim()) {
    errors.batch = 'Batch number is required';
  }

  // Validate SKU (required)
  if (!row.sku.trim()) {
    errors.sku = 'SKU code is required';
  }

  // Validate units (required, positive integer)
  const unitsNum = parseInt(row.units, 10);
  if (!row.units) {
    errors.units = 'Units is required';
  } else if (isNaN(unitsNum) || unitsNum < 0) {
    errors.units = 'Units must be 0 or a positive integer';
  } else if (unitsNum > 1000000) {
    errors.units = 'Units cannot exceed 1,000,000';
  }

  // Validate unit price (required, positive number)
  const priceNum = parseFloat(row.unitPrice);
  if (!row.unitPrice) {
    errors.unitPrice = 'Unit price is required';
  } else if (isNaN(priceNum) || priceNum <= 0) {
    errors.unitPrice = 'Unit price must be a positive number';
  }

  // Validate supplier (required, must be valid)
  if (!row.supplier.trim()) {
    errors.supplier = 'Supplier is required';
  } else if (!VALID_SUPPLIERS.includes(row.supplier)) {
    errors.supplier = `Invalid supplier. Must be one of: ${VALID_SUPPLIERS.join(', ')}`;
  }

  // Validate expiry_date (required, valid date, must be in the future)
  if (!row.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    const date = new Date(row.expiryDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      errors.expiryDate = 'Invalid date format (use YYYY-MM-DD or DD-MM-YYYY)';
    } else if (date <= new Date()) {
      errors.expiryDate = 'Expiry date must be in the future';
    }
  }

  // Validate stock (optional, 0-100)
  if (row.stock) {
    const stockNum = parseInt(row.stock, 10);
    if (isNaN(stockNum) || stockNum < 0 || stockNum > 100) {
      errors.stock = 'Stock level must be between 0 and 100';
    }
  }

  return {
    ...row,
    status: Object.keys(errors).length === 0 ? 'valid' : 'error',
    errors,
  };
}

/**
 * Validate all rows and return updated rows array.
 */
export function validateAllRows(rows: BulkOrderRow[], inventory: InventoryProduct[]): BulkOrderRow[] {
  return rows.map((row) => validateCSVRow(row, inventory));
}

/**
 * Generate a downloadable CSV template with columns matching the Add Product form.
 */
export function generateTemplateCSV(_inventory: InventoryProduct[]): string {
  const header = 'name,category,batch,sku,units,unit_price,expiry_date,supplier,stock';

  // Future expiry date (6 months from now)
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  const defaultDate = futureDate.toISOString().split('T')[0];

  // Provide a few sample rows to guide the user
  const sampleRows = [
    `Amoxicillin 500mg,Antibiotics,AMX-A204,SKU-1001,500,210,${defaultDate},Sun Pharma,50`,
    `Paracetamol 650mg,Analgesics,PAR-P302,SKU-1002,1000,12,${defaultDate},Cipla Ltd,80`,
  ];

  return [header, ...sampleRows].join('\n');
}

/**
 * Trigger a browser file download with the given filename and text content.
 */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
