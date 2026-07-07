"use client";

import {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList, MapPin, Building2, X, Check, ChevronRight,
} from "lucide-react";
import { CATEGORY_META, isSchemeExpired } from "@/lib/api";
import styles from "./SchemeCard.module.css";

// Map icon name strings to Lucide components
const ICON_MAP = {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList,
};

export default function SchemeCard({ scheme, onClick, index = 0 }) {
  const expired = isSchemeExpired(scheme.applicationDeadline);
  const catMeta = CATEGORY_META[scheme.category] || { icon: "ClipboardList", color: "#64748b" };
  const IconComponent = ICON_MAP[catMeta.icon] || ClipboardList;

  return (
    <article
      className={`${styles.card} ${expired ? styles.expired : ""}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Category Icon */}
      <div
        className={styles.iconWrap}
        style={{
          background: expired
            ? "rgba(148, 163, 184, 0.1)"
            : `${catMeta.color}12`,
          color: expired ? "#94a3b8" : catMeta.color,
        }}
      >
        <IconComponent size={22} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{scheme.title}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={14} />
            {scheme.state}
          </span>
          {scheme.ministry && (
            <span className={styles.metaItem}>
              <Building2 size={14} />
              {scheme.ministry}
            </span>
          )}
        </div>

        {/* Status line */}
        <div className={styles.statusRow}>
          {expired ? (
            <span className="badge badge-danger">
              <X size={12} />
              Expired
            </span>
          ) : (
            <span className="badge badge-success">
              <Check size={12} />
              {scheme.schemeStatus || "Active"}
            </span>
          )}

          <span className={`badge badge-info`}>{scheme.category}</span>
        </div>
      </div>

      {/* Right side — Grant amount */}
      <div className={styles.rightCol}>
        <span className={styles.amount}>
          {scheme.grantAmount || "Varies"}
        </span>
        <span className={styles.deadline}>
          {scheme.applicationDeadline
            ? expired
              ? `Ended ${scheme.applicationDeadline}`
              : `Due ${scheme.applicationDeadline}`
            : "Open-ended"}
        </span>
        <div className={styles.arrow}>
          <ChevronRight size={18} />
        </div>
      </div>
    </article>
  );
}
