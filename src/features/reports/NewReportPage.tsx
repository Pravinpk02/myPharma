import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, UploadCloud, CheckCircle, FileText, X } from 'lucide-react';
import { addReport } from '../../services/reportsService';
import styles from './NewReportPage.module.css';

const CATEGORY_OPTIONS = [
  { value: 'Procurement', label: 'Procurement' },
  { value: 'Inventory', label: 'Inventory' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Quality', label: 'Quality' },
  { value: 'Safety', label: 'Safety' },
];

const APPROVER_OPTIONS = [
  { value: 'Dr. Meera', label: 'Dr. Meera (Medical Director)' },
  { value: 'Rajesh Nair', label: 'Rajesh Nair (Procurement Head)' },
  { value: 'Sunita Rao', label: 'Sunita Rao (Financial Controller)' },
  { value: 'Anil Kumar', label: 'Anil Kumar (Compliance Officer)' },
  { value: 'Dr. Priya', label: 'Dr. Priya (Chief Safety Director)' },
  { value: 'Vikram Singh', label: 'Vikram Singh (Operations Manager)' },
];

interface ReceiptItem {
  id: string;
  name: string;
  category: string;
  amount: number;
}

export const NewReportPage: React.FC = () => {
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Procurement');
  const [dateRange, setDateRange] = useState('');
  const [approver, setApprover] = useState('Dr. Meera');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic Items States
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Procurement');
  const [itemAmount, setItemAmount] = useState('');

  // File Upload States
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Compute Total Amount
  const totalAmountVal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  const formattedTotal = useMemo(() => {
    return `₹${totalAmountVal.toLocaleString('en-IN')}`;
  }, [totalAmountVal]);

  // Handle Drag Over
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle Drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle File Input Select
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  }, []);

  // Handle Add Item to Receipt List
  const handleAddItem = useCallback(() => {
    const itemAmt = parseFloat(itemAmount);
    const itemErrors: Record<string, string> = {};

    if (!itemName.trim()) itemErrors.itemName = 'Item description is required';
    if (isNaN(itemAmt) || itemAmt <= 0) itemErrors.itemAmount = 'Enter valid amount';

    if (Object.keys(itemErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...itemErrors }));
      return;
    }

    const newItem: ReceiptItem = {
      id: `ITEM-${Date.now()}`,
      name: itemName.trim(),
      category: itemCategory,
      amount: itemAmt,
    };

    setItems(prev => [...prev, newItem]);
    setItemName('');
    setItemAmount('');
    setErrors(prev => {
      const next = { ...prev };
      delete next.itemName;
      delete next.itemAmount;
      return next;
    });
  }, [itemName, itemCategory, itemAmount]);

  // Handle Remove Item
  const handleRemoveItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Handle Submit Form
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const formErrors: Record<string, string> = {};

    if (!name.trim()) formErrors.name = 'Report name is required';
    if (!dateRange.trim()) formErrors.dateRange = 'Date/Date range description is required';
    if (items.length === 0) formErrors.items = 'Please add at least one receipt item';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Call service to save in stateful mock DB
    addReport({
      name: name.trim(),
      category,
      date: dateRange.trim(),
      approver,
      total: formattedTotal,
      description: description.trim(),
      items: items.map(it => ({ name: it.name, category: it.category, amount: `₹${it.amount.toLocaleString('en-IN')}` })),
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/reports');
    }, 1200);
  }, [name, category, dateRange, approver, description, items, formattedTotal, navigate]);

  return (
    <div className={styles.shell}>
      {/* Success Modal */}
      {success && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h2>Report Submitted Successfully</h2>
            <p>Your expense report has been logged and is awaiting review.</p>
            <div className={styles.successLoading}>Redirecting to Reports...</div>
          </div>
        </div>
      )}

      <div className={styles.mainWrap}>
        {/* Header bar */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/reports')}>
            <ArrowLeft size={16} /> Back to Reports
          </button>
          <div className={styles.titleArea}>
            <h1 className={styles.pageTitle}>Create New Expense Report</h1>
            <p className={styles.pageSub}>Log itemised receipts, attach vouchers, and submit for clearance</p>
          </div>
        </header>

        {/* Form area */}
        <main className={styles.formContainer}>
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            {/* Left Column: Core Fields */}
            <div className={styles.formLeft}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>General Details</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGroup}>
                    <label htmlFor="reportName">Report Title / Purpose</label>
                    <input
                      type="text"
                      id="reportName"
                      placeholder="e.g. Q2 Pharma Travel Reimbursement"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        setErrors(prev => { const n = { ...prev }; delete n.name; return n; });
                      }}
                      className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Primary Category</label>
                      <select
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                      >
                        {CATEGORY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="dateRange">Expense Date / Range</label>
                      <input
                        type="text"
                        id="dateRange"
                        placeholder="e.g. 15 May – 20 May 2026"
                        value={dateRange}
                        onChange={e => {
                          setDateRange(e.target.value);
                          setErrors(prev => { const n = { ...prev }; delete n.dateRange; return n; });
                        }}
                        className={errors.dateRange ? styles.inputError : ''}
                      />
                      {errors.dateRange && <span className={styles.errorText}>{errors.dateRange}</span>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="approver">Assigned Approver</label>
                    <select
                      id="approver"
                      value={approver}
                      onChange={e => setApprover(e.target.value)}
                    >
                      {APPROVER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Notes / Description (Optional)</label>
                    <textarea
                      id="description"
                      rows={3}
                      placeholder="Provide additional details or reasons for this expense"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Receipt Items Manager */}
              <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeader}>
                  <h3>Itemised Expense Breakdown</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.itemAdderGrid}>
                    <div className={styles.formGroup}>
                      <label>Item Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Flight Ticket Mumbai-Delhi"
                        value={itemName}
                        onChange={e => {
                          setItemName(e.target.value);
                          setErrors(prev => { const n = { ...prev }; delete n.itemName; return n; });
                        }}
                        className={errors.itemName ? styles.inputError : ''}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Category</label>
                      <select
                        value={itemCategory}
                        onChange={e => setItemCategory(e.target.value)}
                      >
                        {CATEGORY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Amount (₹)</label>
                      <div className={styles.amountInputWrap}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={itemAmount}
                          onChange={e => {
                            setItemAmount(e.target.value);
                            setErrors(prev => { const n = { ...prev }; delete n.itemAmount; return n; });
                          }}
                          className={errors.itemAmount ? styles.inputError : ''}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.addItemBtn}
                      onClick={handleAddItem}
                    >
                      <Plus size={16} /> Add Item
                    </button>
                  </div>
                  {(errors.itemName || errors.itemAmount) && (
                    <div className={styles.adderErrors}>
                      {errors.itemName && <div className={styles.errorText}>{errors.itemName}</div>}
                      {errors.itemAmount && <div className={styles.errorText}>{errors.itemAmount}</div>}
                    </div>
                  )}

                  {/* List of Added Items */}
                  <div className={styles.itemsListContainer}>
                    {items.length > 0 ? (
                      <table className={styles.itemsTable}>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                            <th style={{ width: '60px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => (
                            <tr key={item.id}>
                              <td className={styles.itemNameCol}>{item.name}</td>
                              <td>
                                <span className={styles.itemCategoryBadge}>{item.category}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                ₹{item.amount.toLocaleString('en-IN')}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className={styles.deleteItemBtn}
                                  onClick={() => handleRemoveItem(item.id)}
                                  title="Delete item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} style={{ fontWeight: 700 }}>Total Calculated Amount</td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent)', fontSize: '15px' }}>
                              {formattedTotal}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div className={styles.noItemsCard}>
                        <FileText size={28} className={styles.noItemsIcon} />
                        <p>No receipt items added yet. Enter details above to log expenses.</p>
                      </div>
                    )}
                  </div>
                  {errors.items && <div className={styles.errorText} style={{ marginTop: '12px' }}>{errors.items}</div>}
                </div>
              </div>
            </div>

            {/* Right Column: File Attachments & Actions */}
            <div className={styles.formRight}>
              {/* Attachment Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Supporting Documents</h3>
                </div>
                <div className={styles.cardBody}>
                  <div
                    className={`${styles.dragArea} ${dragActive ? styles.dragActive : ''} ${uploadedFile ? styles.hasFile : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      className={styles.fileInput}
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                    />
                    
                    {uploadedFile ? (
                      <div className={styles.filePreview}>
                        <FileText size={38} className={styles.fileIcon} />
                        <div className={styles.fileDetails}>
                          <div className={styles.fileName}>{uploadedFile.name}</div>
                          <div className={styles.fileSize}>
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.removeFileBtn}
                          onClick={() => setUploadedFile(null)}
                          title="Remove file"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="fileUpload" className={styles.dragLabel}>
                        <UploadCloud size={32} className={styles.uploadIcon} />
                        <span className={styles.dragText}>
                          Drag and drop receipt here, or <strong className={styles.browseLink}>browse</strong>
                        </span>
                        <span className={styles.dragSubtext}>Supports PDF, JPG, PNG (Max 5MB)</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardBody} style={{ padding: '24px' }}>
                  <div className={styles.totalDisplay}>
                    <span className={styles.totalLabel}>Report Total</span>
                    <span className={styles.totalValue}>{formattedTotal}</span>
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={success}
                    >
                      Submit Expense Report
                    </button>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => navigate('/reports')}
                      disabled={success}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewReportPage;
