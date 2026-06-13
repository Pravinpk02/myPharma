import React, { useState, useRef } from 'react';
import styles from '../SettingsPage.module.css';

interface ProfileTabProps {
  onSaveSuccess: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onSaveSuccess }) => {
  const [profile, setProfile] = useState({
    firstName: 'Pravin',
    lastName: 'Kumar',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    company: 'MyPharma',
    city: 'Bengaluru',
    country: 'India',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAvatarRemove = () => setAvatarUrl(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSuccess();
  };

  const handleCancelProfile = () => {
    setProfile({
      firstName: 'Pravin',
      lastName: 'Kumar',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      company: 'MyPharma',
      city: 'Bengaluru',
      country: 'India',
    });
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Basic Info</h1>
        <p className={styles.sub}>Update your profile details and management role details.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Profile Picture</h2></div>
        <div className={styles.cardBody}>
          <div className={styles.profileAvatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className={styles.avatarImg} style={{ objectFit: 'cover' }} />
            ) : (
              <div className={styles.avatarImg}>{profile.firstName.slice(0, 1) + profile.lastName.slice(0, 1)}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className={styles.avatarBtnRow}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
                <button className={styles.btn} onClick={() => fileInputRef.current?.click()}>Upload Image</button>
                <button
                  className={styles.btnDelete}
                  onClick={handleAvatarRemove}
                  disabled={!avatarUrl}
                  style={{ opacity: avatarUrl ? 1 : 0.45, cursor: avatarUrl ? 'pointer' : 'default' }}
                >
                  Remove
                </button>
              </div>
              <span className={styles.rowDesc} style={{ fontSize: 11.5 }}>JPG, PNG, GIF or WebP. Max 5 MB.</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHd}><h2 className={styles.cardTitle}>Personal Details</h2></div>
        <form onSubmit={handleSaveProfile} className={styles.cardBody}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Role</label>
              <input type="text" value={profile.role} className={`${styles.inputField} ${styles.inputFieldDisabled}`} disabled />
            </div>
          </div>
          <h3 className={styles.cardTitle} style={{ marginTop: 12, borderTop: '1px solid var(--row-border)', paddingTop: 20 }}>Work & Location</h3>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Company</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Country</label>
              <select
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className={`${styles.inputField} ${styles.selectField}`}
                required
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>
          <div className={styles.actionRow}>
            <button type="button" onClick={handleCancelProfile} className={styles.btnSecondary}>Cancel</button>
            <button type="submit" className={styles.btn}>Save Changes</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileTab;
