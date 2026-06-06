import React, { useState } from 'react';
import styles from '../SettingsPage.module.css';

export const NotificationsTab: React.FC = () => {
  const [stockAlerts, setStockAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [tempAlerts, setTempAlerts] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(false);
  const [channelSms, setChannelSms] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');

  const handleSaveNotifications = () => {
    alert('🔔 Notification preferences updated successfully.');
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Notification Settings</h1>
        <p className={styles.sub}>Configure system triggers, delivery channels, and digest schedules.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Pharma Operations Alerts</h2></div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 16, display: 'block' }}>Choose which business operations and telemetry changes trigger system alerts.</span>

          <div className={styles.row} style={{ padding: '12px 0', borderBottom: '1px solid var(--row-border)' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Low Stock Notifications</span>
              <span className={styles.rowDesc}>Triggers an alert when warehouse or store medicine units drop below the safety threshold limit.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={stockAlerts} onChange={(e) => setStockAlerts(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ padding: '12px 0', borderBottom: '1px solid var(--row-border)' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Order Processing Confirmation</span>
              <span className={styles.rowDesc}>Receive alert notifications whenever a customer checkout order is verified or modified.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={orderAlerts} onChange={(e) => setOrderAlerts(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ padding: '12px 0', borderBottom: '1px solid var(--row-border)' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Medicine Expiry Reminders</span>
              <span className={styles.rowDesc}>Generate critical warnings for drug batches expiring within the next 60 days.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={expiryAlerts} onChange={(e) => setExpiryAlerts(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ padding: '12px 0 0 0' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Cold Chain Temperature Telemetry</span>
              <span className={styles.rowDesc}>Instant high-priority warning when storage refrigeration temperatures exceed tolerance bands.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={tempAlerts} onChange={(e) => setTempAlerts(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Delivery Channels</h2></div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 16, display: 'block' }}>Configure which communication channels are used to forward active alerts.</span>

          <div className={styles.row} style={{ padding: '12px 0', borderBottom: '1px solid var(--row-border)' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Real-time Dashboard Toasts</span>
              <span className={styles.rowDesc}>Deliver alerts inside the main browser panel workspace immediately.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={channelInApp} onChange={(e) => setChannelInApp(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ padding: '12px 0', borderBottom: '1px solid var(--row-border)' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Email Notification Digests</span>
              <span className={styles.rowDesc}>Send aggregated summaries and reports directly to your admin inbox.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={channelEmail} onChange={(e) => setChannelEmail(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ padding: '12px 0 0 0' }}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>SMS Alerts</span>
              <span className={styles.rowDesc}>Forward critical cold chain and security logs directly to your verified phone.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={channelSms} onChange={(e) => setChannelSms(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Email Digest Frequency</h2></div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 16, display: 'block' }}>Set how often you receive email notification summaries and system operation statistics.</span>
          <div style={{ maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <select
              value={emailFrequency}
              onChange={(e) => setEmailFrequency(e.target.value as 'immediate' | 'daily' | 'weekly')}
              className={`${styles.inputField} ${styles.selectField}`}
            >
              <option value="immediate">Send Instantly (Real-time)</option>
              <option value="daily">Daily Summaries (Every Morning)</option>
              <option value="weekly">Weekly Compilation (Mondays)</option>
            </select>
            <button className={styles.btn} onClick={handleSaveNotifications} style={{ width: 'fit-content' }}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsTab;
