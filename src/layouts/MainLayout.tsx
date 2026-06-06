import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, TrendingUp, FileText, Settings, LogOut, AlertTriangle, X } from 'lucide-react';
import styles from './MainLayout.module.css';
import { useAppearance } from '../context/AppearanceContext';
import { useAuth } from '../context/AuthContext';

type NavItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
    isLogout?: boolean;
};

const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
        title: 'OVERVIEW',
        items: [
            { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Orders', path: '/orders', icon: <ShoppingCart size={20} />, badge: '12' },
            { label: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
        ],
    },
    {
        title: 'MANAGEMENT',
        items: [
            { label: 'Customers', path: '/customers', icon: <Users size={20} /> },
            { label: 'Analytics', path: '/analytics', icon: <TrendingUp size={20} /> },
            { label: 'Reports', path: '/reports', icon: <FileText size={20} /> },
        ],
    },
    {
        title: 'SYSTEM',
        items: [
            { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
            { label: 'Logout', path: '#', icon: <LogOut size={20} />, isLogout: true },
        ],
    },
];

// ─── Logout Confirmation Modal ─────────────────────────────────────────────────
interface LogoutModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirm = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            onConfirm();
        }, 1200);
    };

    return (
        <div className={styles.logoutOverlay} onClick={onCancel}>
            <div
                className={styles.logoutModal}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
            >
                {/* Close button */}
                {!isLoggingOut && (
                    <button className={styles.logoutClose} onClick={onCancel} aria-label="Cancel logout">
                        <X size={16} />
                    </button>
                )}

                {/* Icon */}
                <div className={`${styles.logoutIconWrap} ${isLoggingOut ? styles.logoutIconSpinning : ''}`}>
                    {isLoggingOut ? (
                        <div className={styles.logoutSpinner} />
                    ) : (
                        <AlertTriangle size={28} />
                    )}
                </div>

                {isLoggingOut ? (
                    <>
                        <h2 className={styles.logoutTitle} id="logout-title">Signing you out…</h2>
                        <p className={styles.logoutBody}>
                            Clearing your session and securing your account.
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className={styles.logoutTitle} id="logout-title">Sign out of MyPharma?</h2>
                        <p className={styles.logoutBody}>
                            You are signed in as <strong>Pravin Kumar</strong> (Super Admin).
                            All unsaved changes will be lost.
                        </p>

                        {/* Session info */}
                        <div className={styles.logoutInfo}>
                            <div className={styles.logoutInfoRow}>
                                <span className={styles.logoutInfoLabel}>Session</span>
                                <span className={styles.logoutInfoValue}>Active · 2 hrs 14 min</span>
                            </div>
                            <div className={styles.logoutInfoRow}>
                                <span className={styles.logoutInfoLabel}>Last activity</span>
                                <span className={styles.logoutInfoValue}>Just now</span>
                            </div>
                            <div className={styles.logoutInfoRow}>
                                <span className={styles.logoutInfoLabel}>Role</span>
                                <span className={styles.logoutInfoValue}>Super Admin</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.logoutActions}>
                            <button
                                className={styles.logoutCancelBtn}
                                onClick={onCancel}
                                autoFocus
                            >
                                Stay Signed In
                            </button>
                            <button
                                className={styles.logoutConfirmBtn}
                                onClick={handleConfirm}
                            >
                                <LogOut size={15} />
                                Yes, Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const MainComp: React.FC = () => {
    const navigate = useNavigate();
    const { draft } = useAppearance();
    const { logout } = useAuth();
    const isMinimal = draft.sidebarLayout === 'minimal';
    const isCompact = draft.sidebarLayout === 'compact';

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutConfirm = () => {
        logout();
        navigate('/login', { state: { isLogout: true } });
    };

    return (
        <div className={styles.layout}>
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${isMinimal ? styles.sidebarMinimal : ''} ${isCompact ? styles.sidebarCompact : ''}`}>

                <div className={styles.brandCard}>
                    <div className={styles.brandIcon}>M</div>
                    {!isMinimal && (
                        <div>
                            <div className={styles.brandName}>MyPharma</div>
                            <div className={styles.brandRole}>ADMIN</div>
                        </div>
                    )}
                </div>

                <div className={styles.navGroup}>
                    <div>
                        {navSections.map((section) => (
                            <div key={section.title} className={styles.section}>
                                {!isMinimal && <div className={styles.sectionTitle}>{section.title}</div>}
                                <nav className={styles.nav}>
                                    {section.items.map((item) => {
                                        // Logout — render as a styled div, not a NavLink
                                        if (item.isLogout) {
                                            return (
                                                <div
                                                    key={item.label}
                                                    className={styles.navLink}
                                                    style={{ cursor: 'pointer' }}
                                                    title={isMinimal ? item.label : undefined}
                                                    onClick={() => setShowLogoutModal(true)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            setShowLogoutModal(true);
                                                        }
                                                    }}
                                                    aria-label="Logout"
                                                >
                                                    {!isCompact && (
                                                        <span className={styles.icon}>
                                                            {item.icon}
                                                        </span>
                                                    )}
                                                    {!isMinimal && (
                                                        <span className={styles.linkText}>
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // All other nav links
                                        return (
                                            <NavLink
                                                key={item.label}
                                                to={item.path}
                                                title={isMinimal ? item.label : undefined}
                                                className={({ isActive }) =>
                                                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                                                }
                                            >
                                                {!isCompact && <span className={styles.icon}>{item.icon}</span>}
                                                {!isMinimal && <span className={styles.linkText}>{item.label}</span>}
                                                {!isMinimal && item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                                            </NavLink>
                                        );
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>

                    <div className={styles.profileCard}>
                        <div className={styles.avatar}>PR</div>
                        {!isMinimal && (
                            <div>
                                <div className={styles.profileName}>Pravin Kumar</div>
                                <div className={styles.profileRole}>Super Admin</div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainComp;
