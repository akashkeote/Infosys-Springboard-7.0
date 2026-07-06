"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ClipboardList,
  IndianRupee,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const getNavItems = (role) => {
  const base = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "schemes", label: "All Schemes", Icon: FileText },
  ];

  // Officers & VLEs see analytics, applications and disbursement
  if (role === "officer" || role === "vle") {
    base.push(
      { id: "analytics", label: "Analytics", Icon: BarChart3 },
      { id: "applications", label: role === "officer" ? "Verification Queue" : "Applications", Icon: ClipboardList },
      { id: "disbursement", label: "Disbursement", Icon: IndianRupee },
    );
  } else {
    // Citizens see their own applications
    base.push(
      { id: "applications", label: "My Applications", Icon: ClipboardList },
    );
  }

  return base;
};

export default function Sidebar({ activeTab, onTabChange, user }) {
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AK";

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          {/* Ashoka Chakra — clean SVG, not emoji */}
          <div className={styles.emblem}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="13" stroke="var(--primary-400)" strokeWidth="2" />
              <circle cx="15" cy="15" r="4.5" fill="var(--primary-400)" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
                <line
                  key={a}
                  x1="15" y1="15"
                  x2={15 + 9 * Math.cos((a * Math.PI) / 180)}
                  y2={15 + 9 * Math.sin((a * Math.PI) / 180)}
                  stroke="var(--primary-400)" strokeWidth="0.8" opacity="0.4"
                />
              ))}
            </svg>
          </div>
          {!collapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandName}>GovGrant</span>
              <span className={styles.brandSub}>Tracker</span>
            </div>
          )}
        </div>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {!collapsed && <span className={styles.navLabel}>Menu</span>}
          {getNavItems(user?.role).map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
            >
              {activeTab === item.id && <div className={styles.activeBar} />}
              <item.Icon size={19} strokeWidth={1.8} />
              {!collapsed && <span className={styles.navText}>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <button
          className={styles.navItem}
          onClick={() => onTabChange("settings")}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={19} strokeWidth={1.8} />
          {!collapsed && <span className={styles.navText}>Settings</span>}
        </button>

        {!collapsed && (
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              <span>{initials}</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "Akash K."}</span>
              <span className={styles.userRole}>{user?.roleLabel || user?.role || "Citizen"}</span>
            </div>
            <button className={styles.logoutBtn} title="Logout" onClick={() => onTabChange("login")}>
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
