import React, { useState } from 'react';
import { Check } from 'lucide-react';
import styles from './SettingsPage.module.css';
import { useAppearance } from '../../context/AppearanceContext';
import type { AccentValue } from '../../context/AppearanceContext';

// Import subcomponents
import ProfileTab from './components/ProfileTab';
import BillingTab from './components/BillingTab';
import SecurityTab from './components/SecurityTab';
import AppearanceTab from './components/AppearanceTab';
import NotificationsTab from './components/NotificationsTab';

const accentHexMap: Record<AccentValue, string> = {
  green: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444',
  orange: '#F97316',
};

const SettingsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'basic' | 'billing' | 'security' | 'appearance' | 'notifications'>('security');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAppearanceSaved, setShowAppearanceSaved] = useState(false);

  const { draft } = useAppearance();

  // Compute the current hex for --accent-color CSS var (used for borders etc.)
  const currentAccentHex = accentHexMap[draft.accentColor];

  const handleProfileSaveSuccess = () => {
    setShowSuccessAlert(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowSuccessAlert(false), 4000);
  };

  const handleAppearanceSaveSuccess = () => {
    setShowAppearanceSaved(true);
    setTimeout(() => setShowAppearanceSaved(false), 4000);
  };

  const sidebarItems = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'billing', label: 'Plans & Billing' },
    { key: 'security', label: 'Account Security' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'notifications', label: 'Notifications' },
  ] as const;

  const renderContent = () => {
    switch (activeSubTab) {
      case 'basic':
        return <ProfileTab onSaveSuccess={handleProfileSaveSuccess} />;
      case 'billing':
        return <BillingTab />;
      case 'security':
        return <SecurityTab />;
      case 'appearance':
        return <AppearanceTab onSaveSuccess={handleAppearanceSaveSuccess} />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.page}>
        <div className={styles.settingsLayout}>

          {/* Settings Sub-Sidebar */}
          <aside className={styles.settingsSidebar}>
            <h2 className={styles.sidebarTitle}>Settings</h2>
            <nav className={styles.sidebarNav}>
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  className={`${styles.sidebarItem} ${activeSubTab === item.key ? styles.sidebarItemActive : ''}`}
                  onClick={() => setActiveSubTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Settings Content Panel */}
          <div
            className={styles.settingsContent}
            style={{ '--accent-color': currentAccentHex } as React.CSSProperties}
          >
            {showSuccessAlert && (
              <div className={styles.alertSuccess}>
                <Check size={16} /> Profile settings updated successfully.
              </div>
            )}

            {showAppearanceSaved && (
              <div className={styles.alertSuccess}>
                <Check size={16} /> Appearance settings saved successfully.
              </div>
            )}

            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
