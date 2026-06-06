import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Save } from 'lucide-react';
import styles from '../SettingsPage.module.css';
import { useAppearance } from '../../../context/AppearanceContext';
import type { ThemeValue, AccentValue, SidebarLayoutValue } from '../../../context/AppearanceContext';

const accentHexMap: Record<AccentValue, string> = {
  green: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444',
  orange: '#F97316',
};

interface AppearanceTabProps {
  onSaveSuccess: () => void;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ onSaveSuccess }) => {
  const { draft, setDraft, saveAppearance, resetDraft, isDirty } = useAppearance();

  // Local draft mirrors context draft (so we can edit without committing)
  const [localTheme, setLocalTheme] = useState<ThemeValue>(draft.theme);
  const [localAccent, setLocalAccent] = useState<AccentValue>(draft.accentColor);
  const [localLayout, setLocalLayout] = useState<SidebarLayoutValue>(draft.sidebarLayout);

  // Sync local state whenever the context draft changes (e.g. on reset)
  useEffect(() => {
    setLocalTheme(draft.theme);
    setLocalAccent(draft.accentColor);
    setLocalLayout(draft.sidebarLayout);
  }, [draft]);

  // Push local changes to context draft (triggers live preview via context)
  const handleThemeChange = (t: ThemeValue) => {
    setLocalTheme(t);
    setDraft(prev => ({ ...prev, theme: t }));
  };
  const handleAccentChange = (a: AccentValue) => {
    setLocalAccent(a);
    setDraft(prev => ({ ...prev, accentColor: a }));
  };
  const handleLayoutChange = (l: SidebarLayoutValue) => {
    setLocalLayout(l);
    setDraft(prev => ({ ...prev, sidebarLayout: l }));
  };

  const handleSaveAppearance = () => {
    saveAppearance({ theme: localTheme, accentColor: localAccent, sidebarLayout: localLayout });
    onSaveSuccess();
  };

  const handleResetAppearance = () => {
    resetDraft();
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Appearance Settings</h1>
        <p className={styles.sub}>Customize how the dashboard workspace looks on your screen.</p>
      </div>

      {/* Live Preview Banner */}
      {isDirty && (
        <div className={styles.previewBanner}>
          <span className={styles.previewBannerText}>
            ✦ Live preview active — changes not yet saved
          </span>
          <div className={styles.previewBannerActions}>
            <button className={styles.btnSecondary} onClick={handleResetAppearance}>
              <RotateCcw size={13} /> Discard
            </button>
            <button className={styles.btn} onClick={handleSaveAppearance}>
              <Save size={13} /> Save Appearance
            </button>
          </div>
        </div>
      )}

      {/* Card 1: Interface Theme */}
      <div className={styles.card}>
        <div className={styles.cardHd}>
          <h2 className={styles.cardTitle}>Interface Theme</h2>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 12, display: 'block' }}>Select or system-sync the visual theme.</span>
          <div className={styles.themeGrid}>

            {/* Light Card */}
            <div
              className={`${styles.themeCard} ${localTheme === 'light' ? styles.themeCardActive : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className={`${styles.themePreview} ${styles.themePreviewLight}`}>
                <div className={styles.miniSidebar}>
                  <div className={`${styles.miniSidebarItem} ${styles.miniSidebarItemActive}`}></div>
                  <div className={styles.miniSidebarItem}></div>
                  <div className={styles.miniSidebarItem}></div>
                </div>
                <div className={styles.miniMain}>
                  <div className={styles.miniHeader}></div>
                  <div className={styles.miniCard}>
                    <div className={styles.miniLine}></div>
                    <div className={styles.miniLineShort}></div>
                  </div>
                </div>
              </div>
              <div className={styles.themeLabelRow}>
                <span className={styles.themeName}>Light Mode</span>
                {localTheme === 'light' && <div className={styles.themeCheck}><Check size={12} /></div>}
              </div>
            </div>

            {/* Dark Card */}
            <div
              className={`${styles.themeCard} ${localTheme === 'dark' ? styles.themeCardActive : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className={`${styles.themePreview} ${styles.themePreviewDark}`}>
                <div className={styles.miniSidebar}>
                  <div className={`${styles.miniSidebarItem} ${styles.miniSidebarItemActive}`}></div>
                  <div className={styles.miniSidebarItem}></div>
                  <div className={styles.miniSidebarItem}></div>
                </div>
                <div className={styles.miniMain}>
                  <div className={styles.miniHeader}></div>
                  <div className={styles.miniCard}>
                    <div className={styles.miniLine}></div>
                    <div className={styles.miniLineShort}></div>
                  </div>
                </div>
              </div>
              <div className={styles.themeLabelRow}>
                <span className={styles.themeName}>Dark Mode</span>
                {localTheme === 'dark' && <div className={styles.themeCheck}><Check size={12} /></div>}
              </div>
            </div>

            {/* System Card */}
            <div
              className={`${styles.themeCard} ${localTheme === 'system' ? styles.themeCardActive : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              <div className={`${styles.themePreview} ${styles.themePreviewSystem}`}></div>
              <div className={styles.themeLabelRow}>
                <span className={styles.themeName}>System Default</span>
                {localTheme === 'system' && <div className={styles.themeCheck}><Check size={12} /></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Brand Accent Color */}
      <div className={styles.card}>
        <div className={styles.cardHd}>
          <h2 className={styles.cardTitle}>Brand Accent Color</h2>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 12, display: 'block' }}>Choose the theme color used for buttons, borders, and active highlights.</span>
          <div className={styles.colorRow}>
            {(['green', 'blue', 'purple', 'red', 'orange'] as const).map((color) => {
              const labelMap: Record<AccentValue, string> = {
                green: 'Emerald Green', blue: 'Ocean Blue', purple: 'Royal Purple',
                red: 'Crimson Red', orange: 'Sunset Orange'
              };
              return (
                <div
                  key={color}
                  className={`${styles.colorCircle} ${localAccent === color ? styles.colorCircleSelected : ''}`}
                  style={{ backgroundColor: accentHexMap[color] }}
                  onClick={() => handleAccentChange(color)}
                  title={labelMap[color]}
                >
                  {localAccent === color && <Check size={16} />}
                </div>
              );
            })}
          </div>
          {/* Accent label */}
          <div className={styles.accentLabelRow}>
            <span className={styles.accentLabel}>
              Selected: <strong>
                {{ green: 'Emerald Green', blue: 'Ocean Blue', purple: 'Royal Purple', red: 'Crimson Red', orange: 'Sunset Orange' }[localAccent]}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Sidebar Layout */}
      <div className={styles.card}>
        <div className={styles.cardHd}>
          <h2 className={styles.cardTitle}>Sidebar Layout Width</h2>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.rowDesc} style={{ marginBottom: 12, display: 'block' }}>Adjust the default width scale of the main navigation sidebar.</span>
          <div className={styles.layoutSelector}>

            {/* Default */}
            <div className={`${styles.layoutCard} ${localLayout === 'default' ? styles.layoutCardActive : ''}`} onClick={() => handleLayoutChange('default')}>
              <div className={styles.layoutPreview}>
                <div className={`${styles.layoutSidebar} ${styles.layoutSidebarDefault}`}>
                  <div className={styles.miniSidebarItem} style={{ width: '80%', height: '4px' }}></div>
                  <div className={styles.miniSidebarItem} style={{ width: '60%', height: '4px' }}></div>
                </div>
                <div className={styles.layoutMain}><div className={styles.miniLine} style={{ width: '40%' }}></div></div>
              </div>
              <span className={styles.layoutText}>Default Width</span>
              <span className={styles.layoutDesc}>Standard full navigation sidebar with labels</span>
            </div>

            {/* Compact */}
            <div className={`${styles.layoutCard} ${localLayout === 'compact' ? styles.layoutCardActive : ''}`} onClick={() => handleLayoutChange('compact')}>
              <div className={styles.layoutPreview}>
                <div className={`${styles.layoutSidebar} ${styles.layoutSidebarCompact}`}>
                  <div className={styles.miniSidebarItem} style={{ width: '75%', height: '4px' }}></div>
                  <div className={styles.miniSidebarItem} style={{ width: '60%', height: '4px' }}></div>
                  <div className={styles.miniSidebarItem} style={{ width: '50%', height: '4px' }}></div>
                </div>
                <div className={styles.layoutMain}><div className={styles.miniLine} style={{ width: '40%' }}></div></div>
              </div>
              <span className={styles.layoutText}>Compact Width</span>
              <span className={styles.layoutDesc}>Narrow sidebar showing labels only — no icons</span>
            </div>

            {/* Minimal */}
            <div className={`${styles.layoutCard} ${localLayout === 'minimal' ? styles.layoutCardActive : ''}`} onClick={() => handleLayoutChange('minimal')}>
              <div className={styles.layoutPreview}>
                <div className={`${styles.layoutSidebar} ${styles.layoutSidebarMinimal}`}>
                  <div className={styles.miniSidebarItem} style={{ width: '6px', height: '6px', borderRadius: '50%' }}></div>
                  <div className={styles.miniSidebarItem} style={{ width: '6px', height: '6px', borderRadius: '50%' }}></div>
                </div>
                <div className={styles.layoutMain}><div className={styles.miniLine} style={{ width: '40%' }}></div></div>
              </div>
              <span className={styles.layoutText}>Minimalist (Icons)</span>
              <span className={styles.layoutDesc}>Collapsed panel with icon indicators only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save / Reset bar */}
      <div className={styles.appearanceActionBar}>
        <button
          className={styles.btnSecondary}
          onClick={handleResetAppearance}
          disabled={!isDirty}
          style={{ opacity: isDirty ? 1 : 0.45 }}
        >
          <RotateCcw size={13} /> Reset to Saved
        </button>
        <button
          className={styles.btn}
          onClick={handleSaveAppearance}
          disabled={!isDirty}
          style={{ opacity: isDirty ? 1 : 0.55 }}
        >
          <Save size={13} /> Save Appearance
        </button>
      </div>
    </>
  );
};

export default AppearanceTab;
