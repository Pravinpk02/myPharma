import React from 'react';
import styles from '../Inventory.module.css';
import type { Metric } from '../types';

interface MetricsRowProps {
  metrics: Metric[];
}

export const MetricsRow: React.FC<MetricsRowProps> = ({ metrics }) => (
  <div className={styles.metrics}>
    {metrics.map((metric) => (
      <div key={metric.label} className={styles.metric}>
        <div className={styles.metricLabel}>{metric.label}</div>
        <div className={styles.metricValue}>{metric.value}</div>
        <div className={`${styles.metricChange} ${styles[metric.status]}`}>{metric.change}</div>
      </div>
    ))}
  </div>
);
export default MetricsRow;
