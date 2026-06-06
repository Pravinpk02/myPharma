import React, { useState } from 'react';
import styles from '../Inventory.module.css';
import { SUPPLIERS, stockColor } from '../types';
import type { InventoryProduct, Supplier } from '../types';
import { X, Search, Star, MapPin, Truck, Mail, Send, CheckCircle } from 'lucide-react';

interface SuppliersCardProps {
  inventory: InventoryProduct[];
}

export const SuppliersCard: React.FC<SuppliersCardProps> = ({ inventory }) => {
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [contactSupplier, setContactSupplier] = useState<Supplier | null>(null);
  const [selectedDirSupplier, setSelectedDirSupplier] = useState<Supplier>(SUPPLIERS[0]);
  const [dirSearchQuery, setDirSearchQuery] = useState('');
  
  // Contact Form State
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Search filter
  const filteredSuppliers = SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(dirSearchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(dirSearchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(dirSearchQuery.toLowerCase()))
  );

  const activeSupplier = filteredSuppliers.find(s => s.name === selectedDirSupplier.name) || filteredSuppliers[0];
  const suppliedProducts = activeSupplier
    ? inventory.filter(p => p.supplier.toLowerCase() === activeSupplier.name.toLowerCase())
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setTimeout(() => {
      setIsSendingMessage(false);
      setMessageSent(true);
    }, 1200); // simulated lead time for email dispatch
  };

  return (
    <>
      <div className={`${styles.glassCard} ${styles.cardPad} ${styles.suppliersCard}`}>
        <div className={styles.cardAccent}></div>
        <div className={styles.cardHead}>
          <div className={styles.supplierCardTitle}>Top Suppliers</div>
          <span className={styles.viewAllLink} onClick={() => {
            if (filteredSuppliers.length > 0) {
              setSelectedDirSupplier(filteredSuppliers[0]);
            }
            setShowDirectoryModal(true);
          }}>View all →</span>
        </div>
        <div className={styles.supplierList}>
          {SUPPLIERS.map((supplier) => (
            <div key={supplier.name} className={styles.supplierCard} onClick={() => {
              setSelectedDirSupplier(supplier);
              setShowDirectoryModal(true);
            }}>
              <div className={styles.supHead}>
                <div className={styles.supAv} style={{ background: supplier.color }}>
                  {supplier.avatar}
                </div>
                <div>
                  <div className={styles.supName}>{supplier.name}</div>
                  <div className={styles.supLoc}>{supplier.location}</div>
                </div>
              </div>
              <div className={styles.supStats}>
                <div className={styles.supStat}>
                  <div className={styles.supStatVal}>{supplier.products}</div>
                  <div className={styles.supStatLbl}>Products</div>
                </div>
                <div className={styles.supStat}>
                  <div className={styles.supStatVal}>★ {supplier.rating}</div>
                  <div className={styles.supStatLbl}>Rating</div>
                </div>
                <div className={styles.supStat}>
                  <div className={styles.supStatVal}>{supplier.delivery}</div>
                  <div className={styles.supStatLbl}>Delivery</div>
                </div>
              </div>
              <div className={styles.supBadges}>
                {supplier.tags.map((tag) => (
                  <span key={tag} className={styles.supTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.supContact}>
                <span className={styles.supPhone}>{supplier.phone}</span>
                <button
                  className={styles.contactBtn}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening details directory
                    setContactSupplier(supplier);
                    setMessageSent(false);
                    setContactMessage('');
                    setContactSubject('');
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Modal */}
      {showDirectoryModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDirectoryModal(false)}>
          <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Supplier Directory</h2>
                <p className={styles.modalSubtitle}>Manage profiles, ratings, and inventory stock distributions</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowDirectoryModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.directoryGrid}>
              {/* Left List */}
              <div className={styles.directoryListPane}>
                <div className={styles.modalSearchBox}>
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search by name, location, tags..."
                    value={dirSearchQuery}
                    onChange={e => setDirSearchQuery(e.target.value)}
                  />
                </div>
                <div className={styles.directoryList}>
                  {filteredSuppliers.map(supplier => (
                    <div
                      key={supplier.name}
                      className={`${styles.directoryItem} ${activeSupplier?.name === supplier.name ? styles.directoryItemActive : ''}`}
                      onClick={() => setSelectedDirSupplier(supplier)}
                    >
                      <div className={styles.supAv} style={{ background: supplier.color }}>
                        {supplier.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className={styles.supName}>{supplier.name}</div>
                        <div className={styles.supLoc}>{supplier.location}</div>
                      </div>
                    </div>
                  ))}
                  {filteredSuppliers.length === 0 && (
                    <div className={styles.noResults}>No suppliers matched your search.</div>
                  )}
                </div>
              </div>

              {/* Right Details */}
              <div className={styles.directoryDetailsPane}>
                {activeSupplier ? (
                  <div className={styles.directoryDetails}>
                    <div className={styles.detailsHeader}>
                      <div className={styles.detailsAvatar} style={{ background: activeSupplier.color }}>
                        {activeSupplier.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 className={styles.detailsName}>{activeSupplier.name}</h3>
                        <p className={styles.detailsLoc}>
                          <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                          {activeSupplier.location}
                        </p>
                      </div>
                      <button
                        className={styles.detailsContactBtn}
                        onClick={() => {
                          setContactSupplier(activeSupplier);
                          setMessageSent(false);
                          setContactMessage('');
                          setContactSubject('');
                        }}
                      >
                        <Mail size={13} style={{ marginRight: 6 }} />
                        Contact
                      </button>
                    </div>

                    {/* Statistics Row */}
                    <div className={styles.detailsStats}>
                      <div className={styles.detailsStat}>
                        <div className={styles.detailsStatLabel}>Rating</div>
                        <div className={styles.detailsStatValue}>
                          <Star size={14} fill="#EF9F27" color="#EF9F27" style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                          {activeSupplier.rating}
                        </div>
                      </div>
                      <div className={styles.detailsStat}>
                        <div className={styles.detailsStatLabel}>Products Supplied</div>
                        <div className={styles.detailsStatValue}>{activeSupplier.products}</div>
                      </div>
                      <div className={styles.detailsStat}>
                        <div className={styles.detailsStatLabel}>Avg. Delivery</div>
                        <div className={styles.detailsStatValue}>
                          <Truck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                          {activeSupplier.delivery}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info & Categories */}
                    <div className={styles.detailsInfoSection}>
                      <div className={styles.detailsInfoRow}>
                        <span className={styles.detailsInfoLabel}>Phone Number:</span>
                        <span className={styles.detailsInfoVal}>{activeSupplier.phone}</span>
                      </div>
                      <div className={styles.detailsInfoRow}>
                        <span className={styles.detailsInfoLabel}>Key Categories:</span>
                        <div className={styles.detailsTags}>
                          {activeSupplier.tags.map(t => (
                            <span key={t} className={styles.supTag}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Supplied Products Table */}
                    <div className={styles.suppliedSection}>
                      <h4 className={styles.suppliedTitle}>Active Supplied Catalog ({suppliedProducts.length})</h4>
                      <div className={styles.suppliedTableContainer}>
                        {suppliedProducts.length > 0 ? (
                          <table className={styles.suppliedTable}>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Stock</th>
                                <th>Units</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {suppliedProducts.map(p => (
                                <tr key={p.id}>
                                  <td className={styles.productNameCell}>{p.name}</td>
                                  <td>{p.sku}</td>
                                  <td>
                                    <div className={styles.stockCell}>
                                      <span style={{ color: stockColor(p.stock) }}>{p.stock}%</span>
                                      <div className={styles.miniGauge}>
                                        <div className={styles.miniGaugeFill} style={{ width: `${p.stock}%`, background: stockColor(p.stock) }} />
                                      </div>
                                    </div>
                                  </td>
                                  <td>{p.units.toLocaleString()}</td>
                                  <td>
                                    <span className={`${styles.suppliedBadge} ${
                                      p.status === 'Good' ? styles.badgeGood :
                                      p.status === 'Low' ? styles.badgeLow :
                                      p.status === 'Critical' ? styles.badgeCritical : styles.badgeOos
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className={styles.noSupplied}>
                            No products found in active inventory for this supplier.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noSelection}>Select a supplier to view details.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactSupplier && (
        <div className={styles.modalOverlay} onClick={() => setContactSupplier(null)}>
          <div className={`${styles.modalContainer} ${styles.contactContainer}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Contact Supplier</h2>
                <p className={styles.modalSubtitle}>Send a secure message to {contactSupplier.name}</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setContactSupplier(null)}>
                <X size={20} />
              </button>
            </div>

            {!messageSent ? (
              <form onSubmit={handleSendMessage} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label className={styles.contactFormLabel}>Recipient Supplier</label>
                  <input
                    type="text"
                    className={styles.contactInputReadOnly}
                    value={contactSupplier.name}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.contactFormLabel}>Supplier Representative Email</label>
                  <input
                    type="text"
                    className={styles.contactInputReadOnly}
                    value={`contact@${contactSupplier.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.contactFormLabel}>Subject</label>
                  <input
                    type="text"
                    className={styles.contactInput}
                    placeholder="e.g. Inquiry regarding purchase order PO-084"
                    value={contactSubject}
                    onChange={e => setContactSubject(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.contactFormLabel}>Message</label>
                  <textarea
                    className={styles.contactTextarea}
                    placeholder="Type your message here..."
                    rows={4}
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.contactSubmitBtn} disabled={isSendingMessage}>
                  {isSendingMessage ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.btnSpinner} />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={14} style={{ marginRight: 6 }} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className={styles.successContainer}>
                <CheckCircle size={52} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Message Sent Successfully</h3>
                <p className={styles.successBody}>
                  Your query has been dispatched to <strong>{contactSupplier.name}</strong>. 
                  A representative will respond to your registered admin email within 24 hours.
                </p>
                <button className={styles.successCloseBtn} onClick={() => setContactSupplier(null)}>
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SuppliersCard;
