"use client";

import { FileText, Building2, MapPin, Tag } from "lucide-react";
import styles from "./StatsCards.module.css";

const STAT_CONFIG = [
  { key: "totalSchemes", label: "Total Schemes", Icon: FileText, color: "#7c3aed", bg: "#ede9fe" },
  { key: "totalMinistries", label: "Ministries", Icon: Building2, color: "#16a34a", bg: "#dcfce7" },
  { key: "totalStates", label: "States / UTs", Icon: MapPin, color: "#ea580c", bg: "#ffedd5" },
  { key: "totalCategories", label: "Categories", Icon: Tag, color: "#0891b2", bg: "#ecfeff" },
];

export default function StatsCards({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className={styles.grid}>
        {STAT_CONFIG.map((s) => (
          <div key={s.key} className={styles.card}>
            <div className={styles.iconWrap} style={{ background: s.bg }}>
              <s.Icon size={20} color={s.color} strokeWidth={1.8} />
            </div>
            <div className={styles.cardContent}>
              <div className={`skeleton ${styles.skeletonValue}`} />
              <span className={styles.label}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {STAT_CONFIG.map((s, i) => (
        <div key={s.key} className={styles.card} style={{ animationDelay: `${i * 80}ms` }}>
          <div className={styles.iconWrap} style={{ background: s.bg }}>
            <s.Icon size={20} color={s.color} strokeWidth={1.8} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.value} style={{ color: s.color }}>
              {stats[s.key]?.toLocaleString() || "—"}
            </span>
            <span className={styles.label}>{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
