import React, { useState } from 'react';
import { Lock, Terminal, Compass, Monitor, Globe } from 'lucide-react';
import styles from '../SettingsPage.module.css';

interface DeviceSession {
  id: string;
  os: string;
  browser: string;
  status: 'active' | 'paused' | 'disconnected';
  statusText: string;
  details: string;
  icon: React.ReactNode;
}

const sessions: DeviceSession[] = [
  { id: '1', os: 'MacOS', browser: 'Safari', status: 'active', statusText: 'Live Session', details: 'In Use : 26', icon: <Compass size={20} /> },
  { id: '2', os: 'Windows', browser: 'Firefox', status: 'paused', statusText: 'Paused Session', details: 'In Use : 26', icon: <Monitor size={20} /> },
  { id: '3', os: 'Linux', browser: 'Firefox Developer Edition', status: 'active', statusText: 'Live Session', details: 'In Use : 26', icon: <Terminal size={20} /> },
  { id: '4', os: 'MacOS', browser: 'Chrome', status: 'disconnected', statusText: 'Disconnected', details: 'In Use : 26', icon: <Globe size={20} /> },
];

export const SecurityTab: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const handlePasswordChange = () => {
    alert('🔐 Redirecting to change password form...');
  };

  const handleManageDevices = () => {
    alert('💻 Opening advanced device session management panel...');
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Security</h1>
        <p className={styles.sub}>Manage your security settings, password strength, and active web sessions.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Account Info</h2></div>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Email Address</span>
              <span className={styles.rowDesc}>Need to update your email? Hit up <span className={styles.link} onClick={() => alert('📧 Contacting support...')}>Customer Service.</span></span>
            </div>
            <div className={styles.rowRight}>
              <span className={styles.rowDesc} style={{ marginRight: 16, fontWeight: 700 }}>pravin@mypharma.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Security Settings</h2></div>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Google Authenticator (2FA)</span>
              <span className={styles.rowDesc}>Extra layer of security? Always a good move.</span>
            </div>
            <div className={styles.rowRight}>
              <label className={styles.switch}>
                <input type="checkbox" checked={is2FAEnabled} onChange={(e) => setIs2FAEnabled(e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowTitle}>Password</span>
              <span className={styles.rowDesc}>Set a strong one!</span>
            </div>
            <div className={styles.rowRight}>
              <button className={styles.btn} onClick={handlePasswordChange}><Lock size={14} /> Set Password</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}>
          <div className={styles.row} style={{ width: '100%' }}>
            <div className={styles.rowLeft}>
              <h2 className={styles.cardTitle}>Device Management</h2>
              <span className={styles.rowDesc}>Manage which devices can access your account.</span>
            </div>
            <div className={styles.rowRight}><button className={styles.btn} onClick={handleManageDevices}>Manage</button></div>
          </div>
        </div>
        <div className={styles.deviceList}>
          {sessions.map((session) => {
            const statusClass =
              session.status === 'active' ? styles.active :
              session.status === 'paused' ? styles.paused : styles.disconnected;
            return (
              <div key={session.id} className={styles.deviceRow}>
                <div className={styles.deviceIconWrapper}>{session.icon}</div>
                <div className={styles.deviceDetails}>
                  <span className={styles.deviceName}>{session.os}</span>
                  <div className={styles.deviceMeta}>
                    <span className={`${styles.deviceStatus} ${statusClass}`}>
                      <span className={styles.statusDot}></span>
                      {session.statusText}
                    </span>
                    <span className={styles.deviceTime}>{session.details}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SecurityTab;
