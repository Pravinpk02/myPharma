import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageLoader.module.css';

export const PageLoader: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the route transition is due to a logout
    if (location.state?.isLogout) {
      return;
    }

    // Trigger page loading transition
    setLoading(true);
    setVisible(true);

    // Fade out phase
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 600); // loading duration: 600ms

    // Complete removal phase
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 850); // fade transition takes 250ms

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : styles.hidden}`} aria-hidden="true">
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>M</div>
          <div className={styles.brandText}>MyPharma</div>
        </div>
        <div className={styles.loaderLine}>
          <div className={styles.loaderFill} />
        </div>
        <span className={styles.statusText}>Loading portal...</span>
      </div>
    </div>
  );
};

export default PageLoader;
