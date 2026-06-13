import React from 'react';
import { Download, Check } from 'lucide-react';
import styles from '../SettingsPage.module.css';

interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
}

const invoices: InvoiceItem[] = [
  { id: 'INV-20491', date: '01 May 2026', amount: '₹9,999', status: 'paid' },
  { id: 'INV-20480', date: '01 Apr 2026', amount: '₹9,999', status: 'paid' },
  { id: 'INV-20468', date: '01 Mar 2026', amount: '₹9,999', status: 'paid' },
];

export const BillingTab: React.FC = () => {
  const handleDownloadInvoice = (id: string) => {
    alert(`📄 Downloading PDF invoice receipt for ${id}...`);
  };

  const handleCancelSubscription = () => {
    const confirm = window.confirm('Are you sure you want to cancel your MyPharma Pro subscription?');
    if (confirm) {
      alert('❌ Subscription cancellation request submitted.');
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Plans & Billing</h1>
        <p className={styles.sub}>View your current plan, check billing invoices, and update billing card details.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Current Plan</h2></div>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle} style={{ fontSize: 16, color: 'var(--text)' }}>MyPharma Pro Admin Suite</span>
              <span className={styles.rowDesc}>Unlimited reports, Multi-location sync, Super Admin seat</span>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}><Check size={14} className={styles.active} /> Up to 5 administrator seats</li>
                <li className={styles.featureItem}><Check size={14} className={styles.active} /> Advanced analytics and reports exports</li>
                <li className={styles.featureItem}><Check size={14} className={styles.active} /> Priority 24/7 support</li>
              </ul>
            </div>
            <div className={styles.rowRight} style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span className={styles.invoiceStatus} style={{ alignSelf: 'flex-end' }}>Active</span>
              <span className={styles.rowTitle} style={{ fontSize: 22, color: 'var(--accent)', fontWeight: 800 }}>
                ₹9,999<span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>/month</span>
              </span>
              <span className={styles.rowDesc}>Next renewal date: June 30, 2026</span>
            </div>
          </div>
          <div className={styles.actionRow} style={{ marginTop: 8 }}>
            <button className={styles.btnDanger} onClick={handleCancelSubscription}>Cancel Subscription</button>
            <button className={styles.btn} onClick={() => alert('🔄 Opening subscription plan options...')}>Change Plan</button>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Payment Method</h2></div>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={styles.rowLeft} style={{ flex: 1 }}>
              <span className={styles.rowTitle}>Linked Credit Card</span>
              <span className={styles.rowDesc}>Linked billing email: <span className={styles.link}>pravin@mypharma.com</span></span>
              <div className={styles.creditCardBox}>
                <div className={styles.cardLogo}>VISA</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className={styles.rowTitle} style={{ fontSize: 13 }}>Visa ending in 4821</span>
                  <span className={styles.rowDesc} style={{ fontSize: 11 }}>Expires 08/2028</span>
                </div>
              </div>
            </div>
            <div className={styles.rowRight}>
              <button className={styles.btn} onClick={() => alert('💳 Opening Credit Card Edit Panel...')}>Edit Card</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Billing History</h2></div>
        <div className={styles.cardBody}>
          <table className={styles.billingTable}>
            <thead>
              <tr>
                <th>Date</th><th>Invoice ID</th><th>Amount</th><th>Status</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.date}</td>
                  <td className={styles.invoiceId}>{inv.id}</td>
                  <td>{inv.amount}</td>
                  <td><span className={styles.invoiceStatus}><Check size={10} style={{ marginRight: 2 }} /> {inv.status.toUpperCase()}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={styles.downloadBtn} title="Download PDF" onClick={() => handleDownloadInvoice(inv.id)}>
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BillingTab;
