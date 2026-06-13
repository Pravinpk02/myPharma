import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  DragEvent,
  ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  PackageCheck,
  Zap,
  Check,
  AlertTriangle,
} from 'lucide-react';
import styles from './BulkOrderUpdatePage.module.css';
import { bulkAddProductsApi } from '../../api/inventoryApi';
import { INVENTORY_DATA } from './types';
import type { BulkOrderRow, BulkUploadResult, InventoryProduct } from './types';
import {
  parseCSV,
  validateAllRows,
  generateTemplateCSV,
  downloadCSV,
} from './utils/csvUtils';

type Stage = 'upload' | 'preview' | 'success';

const VALID_SUPPLIERS = ['Sun Pharma', 'Cipla Ltd', 'Abbott India', "Dr. Reddy's"];
const VALID_CATEGORIES = ['Antibiotics', 'Vitamins', 'Analgesics', 'Cardiology', 'Diabetes', 'Supplements'];

// Load inventory from localStorage or fall back to static data
function loadInventory(): InventoryProduct[] {
  try {
    const raw = localStorage.getItem('mypharma_inventory_db');
    if (raw) {
      return JSON.parse(raw).map((p: any) => ({
        ...p,
        expiryDate: new Date(p.expiryDate),
      }));
    }
  } catch {}
  return INVENTORY_DATA;
}

export const BulkOrderUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>('upload');
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<BulkOrderRow[]>([]);
  const [parseError, setParseError] = useState('');
  const [loadedFileName, setLoadedFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [countdown, setCountdown] = useState(6);
  const inventory = loadInventory();

  // Countdown redirect after success — pass state to force inventory re-fetch
  useEffect(() => {
    if (stage !== 'success') return;
    if (countdown <= 0) {
      navigate('/inventory', { state: { forceRefresh: true } });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, countdown, navigate]);

  // ── CSV Processing ──
  const processFile = useCallback(
    (file: File) => {
      setParseError('');
      setLoadedFileName('');

      if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
        setParseError('Invalid file type. Please upload a .csv file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setParseError('File too large. Maximum allowed size is 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;

        if (!text || text.trim().length === 0) {
          setParseError('The uploaded file is empty. Please upload a valid CSV file with data.');
          return;
        }

        // Validate CSV header
        const firstLine = text.split(/\r?\n/)[0] || '';
        const headers = firstLine.split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
        const requiredHeaders = ['name', 'category', 'batch', 'sku', 'units', 'unit_price', 'expiry_date', 'supplier'];
        // Also accept alternate header names
        const altHeaders: Record<string, string[]> = {
          name: ['name', 'product_name'],
          batch: ['batch', 'batch_number'],
          sku: ['sku', 'sku_code'],
          units: ['units', 'initial_units'],
          unit_price: ['unit_price', 'price'],
        };

        const missingHeaders = requiredHeaders.filter((h) => {
          const alternates = altHeaders[h] || [h];
          return !alternates.some((alt) => headers.includes(alt));
        });

        if (missingHeaders.length > 0) {
          setParseError(
            `Invalid CSV format. Missing required columns: ${missingHeaders.join(', ')}. ` +
            `Expected headers: name, category, batch, sku, units, unit_price, expiry_date, supplier, stock`
          );
          return;
        }

        const parsed = parseCSV(text);

        if (parsed.length === 0) {
          setParseError(
            'No data rows found. Ensure the CSV has a header row and at least one data row.'
          );
          return;
        }

        const validated = validateAllRows(parsed, inventory);
        setLoadedFileName(file.name);
        setRows(validated);
        setStage('preview');
      };
      reader.onerror = () => setParseError('Failed to read the file. Please try again.');
      reader.readAsText(file);
    },
    [inventory]
  );

  // Drag handlers
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  // Template download
  const handleTemplateDownload = () => {
    const csv = generateTemplateCSV(inventory);
    downloadCSV('bulk_product_template.csv', csv);
  };

  // Sample CSV download
  const handleSampleDownload = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    const defDate = futureDate.toISOString().split('T')[0];

    const sampleCSV = [
      'name,category,batch,sku,units,unit_price,expiry_date,supplier,stock',
      `Amoxicillin 500mg,Antibiotics,AMX-A204,SKU-1001,500,210,${defDate},Sun Pharma,50`,
      `Paracetamol 650mg,Analgesics,PAR-P302,SKU-1002,1000,12,${defDate},Cipla Ltd,80`,
      `Metformin 1000mg,Diabetes,MET-D119,SKU-1003,800,190,${defDate},Dr. Reddy's,65`,
    ].join('\n');
    downloadCSV('sample_bulk_products.csv', sampleCSV);
  };

  // ── Inline Editing ──
  const updateRow = useCallback(
    (rowIndex: number, field: keyof BulkOrderRow, value: string) => {
      setRows((prev) => {
        const updated = prev.map((r) => {
          if (r.rowIndex !== rowIndex) return r;
          const patched = { ...r, [field]: value };
          // Re-validate this row
          const [revalidated] = validateAllRows([patched], inventory);
          return revalidated;
        });
        return updated;
      });
    },
    [inventory]
  );

  // ── Submit ──
  const handleProcess = useCallback(async () => {
    const validRows = rows.filter((r) => r.status === 'valid');
    if (validRows.length === 0) return;

    setProcessing(true);

    // Mark all valid rows as processing
    setRows((prev) => prev.map((r) => (r.status === 'valid' ? { ...r, status: 'processing' } : r)));

    try {
      const res = await bulkAddProductsApi(validRows);
      setResult(res);

      // Mark rows as done
      setRows((prev) =>
        prev.map((r) => (r.status === 'processing' ? { ...r, status: 'done' } : r))
      );
      setStage('success');
      setCountdown(6);
    } catch (err) {
      console.error('Bulk add failed:', err);
      setRows((prev) =>
        prev.map((r) => (r.status === 'processing' ? { ...r, status: 'valid' } : r))
      );
      setParseError('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [rows]);

  // Reset to upload stage
  const handleReset = () => {
    setRows([]);
    setParseError('');
    setResult(null);
    setLoadedFileName('');
    setStage('upload');
    setCountdown(6);
  };

  // Derived stats
  const validCount = rows.filter((r) => r.status === 'valid' || r.status === 'done').length;
  const errorCount = rows.filter((r) => r.status === 'error').length;
  const hasErrors = errorCount > 0;

  // ── Step bar helper ──
  const stepState = (s: Stage): 'stepActive' | 'stepDone' | '' => {
    const order: Stage[] = ['upload', 'preview', 'success'];
    const current = order.indexOf(stage);
    const idx = order.indexOf(s);
    if (idx === current) return 'stepActive';
    if (idx < current) return 'stepDone';
    return '';
  };

  return (
    <div className={styles.shell}>
      <div className={styles.mainWrap}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/inventory')}>
            <ArrowLeft size={16} /> Back to Inventory
          </button>
          <div className={styles.titleRow}>
            <div className={styles.titleArea}>
              <h1 className={styles.pageTitle}>Bulk Product Upload</h1>
              <p className={styles.pageSub}>
                Upload a CSV file to add multiple products to the inventory at once
              </p>
            </div>
          </div>
        </header>

        {/* Step Progress */}
        <div className={styles.stepBar}>
          {(
            [
              { key: 'upload', num: '1', title: 'Upload CSV', desc: 'Select or drag your file' },
              { key: 'preview', num: '2', title: 'Preview & Validate', desc: 'Review and fix errors' },
              { key: 'success', num: '3', title: 'Complete', desc: 'Products added' },
            ] as const
          ).map((s) => {
            const state = stepState(s.key);
            return (
              <div key={s.key} className={`${styles.step} ${state ? styles[state] : ''}`}>
                <div className={styles.stepCircle}>
                  {state === 'stepDone' ? <Check size={14} /> : s.num}
                </div>
                <div className={styles.stepLabel}>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepDesc}>{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── STAGE 1: UPLOAD ── */}
        {stage === 'upload' && (
          <div className={styles.uploadCard}>
            <div className={styles.uploadCardHeader}>
              <h2 className={styles.uploadCardTitle}>
                <Upload size={18} className={styles.uploadCardTitleIcon} />
                Upload Products CSV File
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.templateBtn} onClick={handleTemplateDownload}>
                  <Download size={14} />
                  Download Template
                </button>
                <button className={styles.templateBtn} onClick={handleSampleDownload}>
                  <Download size={14} />
                  Sample CSV
                </button>
              </div>
            </div>

            {/* Parse Error */}
            {parseError && (
              <div className={styles.parseError}>
                <AlertCircle size={16} />
                {parseError}
              </div>
            )}

            {/* Drop Zone */}
            <div
              className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={40} className={styles.dropIcon} />
              <p className={styles.dropTitle}>Drag & drop your CSV file here</p>
              <p className={styles.dropSub}>
                or click anywhere in this box to browse files
              </p>
              <span className={styles.dropOr}>— or —</span>
              <button
                className={styles.browseBtnLabel}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FileText size={14} />
                Browse File
              </button>
              <div className={styles.dropHints}>
                <span className={styles.dropHint}>
                  <Check size={11} /> CSV format only
                </span>
                <span className={styles.dropHint}>
                  <Check size={11} /> Max 5 MB
                </span>
                <span className={styles.dropHint}>
                  <Check size={11} /> UTF-8 encoding
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
            </div>

            {/* Format Guide — matches Add Product fields */}
            <div className={styles.formatGuide}>
              <p className={styles.formatGuideTitle}>📋 Expected CSV Format (Same as Add Product)</p>
              <table className={styles.formatTable}>
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Required</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      col: 'name',
                      req: true,
                      desc: 'Product name with dosage strength',
                      ex: 'Amoxicillin 500mg',
                    },
                    {
                      col: 'category',
                      req: true,
                      desc: `Category: ${VALID_CATEGORIES.join(', ')}`,
                      ex: 'Antibiotics',
                    },
                    {
                      col: 'batch',
                      req: true,
                      desc: 'Batch number / lot number',
                      ex: 'AMX-A204',
                    },
                    {
                      col: 'sku',
                      req: true,
                      desc: 'SKU code / stock keeping unit',
                      ex: 'SKU-1001',
                    },
                    {
                      col: 'units',
                      req: true,
                      desc: 'Initial units in stock (0 or more)',
                      ex: '500',
                    },
                    {
                      col: 'unit_price',
                      req: true,
                      desc: 'Price per unit in ₹',
                      ex: '210',
                    },
                    {
                      col: 'expiry_date',
                      req: true,
                      desc: 'Expiry date (YYYY-MM-DD, DD-MM-YYYY, etc.)',
                      ex: '2027-06-15',
                    },
                    {
                      col: 'supplier',
                      req: true,
                      desc: `Supplier: ${VALID_SUPPLIERS.join(', ')}`,
                      ex: 'Sun Pharma',
                    },
                    {
                      col: 'stock',
                      req: false,
                      desc: 'Shelf fill / stock level percentage (0–100, defaults 50)',
                      ex: '75',
                    },
                  ].map((row) => (
                    <tr key={row.col}>
                      <td>
                        <code className={styles.colName}>{row.col}</code>
                      </td>
                      <td>
                        <span
                          className={`${styles.reqBadge} ${row.req ? styles.required : styles.optional}`}
                        >
                          {row.req ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td>{row.desc}</td>
                      <td style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{row.ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STAGE 2: PREVIEW & VALIDATE ── */}
        {stage === 'preview' && (
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <h2 className={styles.previewTitle}>
                Review & Validate Products ({rows.length} rows)
                {loadedFileName && (
                  <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', marginLeft: 8 }}>
                    — from <strong style={{ color: 'var(--accent)' }}>{loadedFileName}</strong>
                  </span>
                )}
              </h2>
              <div className={styles.statsBadges}>
                <span className={`${styles.statBadge} ${styles.total}`}>
                  <FileText size={12} />
                  {rows.length} total
                </span>
                <span className={`${styles.statBadge} ${styles.valid}`}>
                  <CheckCircle size={12} />
                  {validCount} valid
                </span>
                {errorCount > 0 && (
                  <span className={`${styles.statBadge} ${styles.error}`}>
                    <AlertCircle size={12} />
                    {errorCount} errors
                  </span>
                )}
              </div>
            </div>

            {parseError && (
              <div className={styles.parseError}>
                <AlertCircle size={16} />
                {parseError}
              </div>
            )}

            {/* Preview Table */}
            <div className={styles.tableWrap}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Batch</th>
                    <th>SKU</th>
                    <th>Units</th>
                    <th>Price (₹)</th>
                    <th>Expiry Date</th>
                    <th>Supplier</th>
                    <th>Stock %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.rowIndex}
                      className={
                        row.status === 'error'
                          ? styles.rowError
                          : row.status === 'done'
                          ? styles.rowDone
                          : ''
                      }
                    >
                      {/* Row number */}
                      <td className={styles.rowNum}>{row.rowIndex}</td>

                      {/* Name */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.name ? styles.cellError : ''
                            }`}
                            value={row.name}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'name', e.target.value)
                            }
                            placeholder="Amoxicillin 500mg"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ minWidth: 140 }}
                          />
                          {row.errors.name && (
                            <span className={styles.cellErrTip}>{row.errors.name}</span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <div>
                          <select
                            className={`${styles.editSelect} ${
                              row.errors.category ? styles.cellError : ''
                            }`}
                            value={row.category}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'category', e.target.value)
                            }
                            disabled={row.status === 'done' || row.status === 'processing'}
                          >
                            <option value="">-- Select --</option>
                            {VALID_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          {row.errors.category && (
                            <span className={styles.cellErrTip}>{row.errors.category}</span>
                          )}
                        </div>
                      </td>

                      {/* Batch */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.batch ? styles.cellError : ''
                            }`}
                            value={row.batch}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'batch', e.target.value)
                            }
                            placeholder="AMX-A204"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ minWidth: 90 }}
                          />
                          {row.errors.batch && (
                            <span className={styles.cellErrTip}>{row.errors.batch}</span>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.sku ? styles.cellError : ''
                            }`}
                            value={row.sku}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'sku', e.target.value)
                            }
                            placeholder="SKU-1001"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ minWidth: 80 }}
                          />
                          {row.errors.sku && (
                            <span className={styles.cellErrTip}>{row.errors.sku}</span>
                          )}
                        </div>
                      </td>

                      {/* Units */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.units ? styles.cellError : ''
                            }`}
                            type="number"
                            value={row.units}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'units', e.target.value)
                            }
                            placeholder="500"
                            min="0"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ maxWidth: 80 }}
                          />
                          {row.errors.units && (
                            <span className={styles.cellErrTip}>{row.errors.units}</span>
                          )}
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.unitPrice ? styles.cellError : ''
                            }`}
                            type="number"
                            value={row.unitPrice}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'unitPrice', e.target.value)
                            }
                            placeholder="210"
                            min="0"
                            step="0.01"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ maxWidth: 80 }}
                          />
                          {row.errors.unitPrice && (
                            <span className={styles.cellErrTip}>{row.errors.unitPrice}</span>
                          )}
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.expiryDate ? styles.cellError : ''
                            }`}
                            type="date"
                            value={row.expiryDate}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'expiryDate', e.target.value)
                            }
                            disabled={row.status === 'done' || row.status === 'processing'}
                          />
                          {row.errors.expiryDate && (
                            <span className={styles.cellErrTip}>{row.errors.expiryDate}</span>
                          )}
                        </div>
                      </td>

                      {/* Supplier */}
                      <td>
                        <div>
                          <select
                            className={`${styles.editSelect} ${
                              row.errors.supplier ? styles.cellError : ''
                            }`}
                            value={row.supplier}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'supplier', e.target.value)
                            }
                            disabled={row.status === 'done' || row.status === 'processing'}
                          >
                            <option value="">-- Select --</option>
                            {VALID_SUPPLIERS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {row.errors.supplier && (
                            <span className={styles.cellErrTip}>{row.errors.supplier}</span>
                          )}
                        </div>
                      </td>

                      {/* Stock % */}
                      <td>
                        <div>
                          <input
                            className={`${styles.editCell} ${
                              row.errors.stock ? styles.cellError : ''
                            }`}
                            type="number"
                            value={row.stock}
                            onChange={(e) =>
                              updateRow(row.rowIndex, 'stock', e.target.value)
                            }
                            placeholder="50"
                            min="0"
                            max="100"
                            disabled={row.status === 'done' || row.status === 'processing'}
                            style={{ maxWidth: 60 }}
                          />
                          {row.errors.stock && (
                            <span className={styles.cellErrTip}>{row.errors.stock}</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {row.status === 'valid' && (
                          <span className={`${styles.statusBadge} ${styles.badgeValid}`}>
                            <CheckCircle size={12} /> Valid
                          </span>
                        )}
                        {row.status === 'error' && (
                          <span className={`${styles.statusBadge} ${styles.badgeError}`}>
                            <AlertCircle size={12} /> Error
                          </span>
                        )}
                        {row.status === 'processing' && (
                          <span className={`${styles.statusBadge} ${styles.badgeProcessing}`}>
                            <div className={styles.spinner} /> Processing
                          </span>
                        )}
                        {row.status === 'done' && (
                          <span className={`${styles.statusBadge} ${styles.badgeDone}`}>
                            <CheckCircle size={12} /> Done
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className={styles.actionBar}>
              <div className={styles.actionBarLeft}>
                <button className={styles.reuploadBtn} onClick={handleReset}>
                  <RotateCcw size={14} />
                  Re-upload File
                </button>
                {hasErrors && (
                  <span className={styles.errorCount}>
                    <AlertTriangle size={14} />
                    {errorCount} error{errorCount > 1 ? 's' : ''} — fix before submitting
                  </span>
                )}
                {!hasErrors && validCount > 0 && (
                  <span className={styles.errorCount} style={{ color: 'var(--accent)' }}>
                    <CheckCircle size={14} />
                    All {validCount} rows valid — ready to process
                  </span>
                )}
              </div>
              <button
                className={styles.processBtn}
                onClick={handleProcess}
                disabled={hasErrors || validCount === 0 || processing}
              >
                {processing ? (
                  <>
                    <div className={styles.spinner} />
                    Processing…
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Add {validCount} Product{validCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 3: SUCCESS ── */}
        {stage === 'success' && result && (
          <div className={styles.successCard}>
            <PackageCheck size={64} className={styles.successIcon} />
            <h2 className={styles.successTitle}>Products Added Successfully!</h2>
            <p className={styles.successSub}>
              {result.successRows} product{result.successRows !== 1 ? 's were' : ' was'}{' '}
              added to the inventory database.
            </p>

            {/* Summary Stats */}
            <div className={styles.summaryStats}>
              <div className={styles.summaryStatCard}>
                <span className={styles.summaryStatVal}>{result.totalRows}</span>
                <span className={styles.summaryStatLabel}>Total Rows</span>
              </div>
              <div className={styles.summaryStatCard}>
                <span className={styles.summaryStatVal} style={{ color: 'var(--accent)' }}>
                  {result.successRows}
                </span>
                <span className={styles.summaryStatLabel}>Products Added</span>
              </div>
              <div className={styles.summaryStatCard}>
                <span
                  className={styles.summaryStatVal}
                  style={{ color: result.failedRows > 0 ? '#E24B4A' : 'var(--accent)' }}
                >
                  {result.failedRows}
                </span>
                <span className={styles.summaryStatLabel}>Failed</span>
              </div>
              <div className={styles.summaryStatCard}>
                <span className={styles.summaryStatVal}>
                  {result.addedProducts
                    .reduce((sum, p) => sum + p.units, 0)
                    .toLocaleString()}
                </span>
                <span className={styles.summaryStatLabel}>Total Units Added</span>
              </div>
            </div>

            {/* Added Products List */}
            {result.addedProducts.length > 0 && (
              <div className={styles.updatedList}>
                <div className={styles.updatedListHeader}>Added Products</div>
                {result.addedProducts.map((p, idx) => (
                  <div key={idx} className={styles.updatedItem}>
                    <span className={styles.updatedItemName}>{p.name}</span>
                    <span className={styles.updatedItemQty}>
                      {p.category}
                    </span>
                    <span className={styles.updatedItemNew}>
                      {p.units.toLocaleString()} units • {p.supplier}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Redirect bar */}
            <p className={styles.redirectBar}>
              <CheckCircle size={14} />
              Redirecting to Inventory in {countdown}s…
            </p>

            {/* Action Buttons */}
            <div className={styles.redirectActions}>
              <button className={styles.redirectBtn} onClick={() => navigate('/inventory', { state: { forceRefresh: true } })}>
                <ArrowLeft size={14} />
                Go to Inventory Now
              </button>
              <button className={styles.anotherBtn} onClick={handleReset}>
                <Upload size={14} />
                Upload Another CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOrderUpdatePage;
