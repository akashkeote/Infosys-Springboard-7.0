"use client";

import { useEffect } from "react";
import {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList, MapPin, Building2, X, Check,
  Info, CheckCircle2, IndianRupee, ClipboardCheck, FileText,
  ExternalLink, ArrowRight, Video,
} from "lucide-react";
import { CATEGORY_META, isSchemeExpired } from "@/lib/api";
import styles from "./SchemeModal.module.css";

const ICON_MAP = {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList,
};

export default function SchemeModal({ scheme, onClose }) {
  const expired = isSchemeExpired(scheme?.applicationDeadline);
  const catMeta = CATEGORY_META[scheme?.category] || { icon: "ClipboardList", color: "#64748b" };
  const IconComponent = ICON_MAP[catMeta.icon] || ClipboardList;

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!scheme) return null;

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(scheme.title + " scheme how to apply")}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header} style={{ borderBottomColor: catMeta.color + "30" }}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap} style={{ background: catMeta.color + "15", color: catMeta.color }}>
              <IconComponent size={28} strokeWidth={1.6} />
            </div>
            <div>
              <h2 className={styles.title}>{scheme.title}</h2>
              <div className={styles.headerMeta}>
                <span className="badge badge-primary">{scheme.category}</span>
                {expired ? (
                  <span className="badge badge-danger">Expired</span>
                ) : (
                  <span className="badge badge-success">{scheme.schemeStatus || "Active"}</span>
                )}
                <span className={styles.metaText}><MapPin size={13} /> {scheme.state}</span>
                {scheme.ministry && <span className={styles.metaText}><Building2 size={13} /> {scheme.ministry}</span>}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Key Info Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Grant Amount</span>
              <span className={styles.infoValue} style={{ color: catMeta.color }}>{scheme.grantAmount || "Varies"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Income Limit</span>
              <span className={styles.infoValue}>{scheme.incomeLimit || "Not specified"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Deadline</span>
              <span className={styles.infoValue}>{scheme.applicationDeadline || "Open-ended"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Start Date</span>
              <span className={styles.infoValue}>{scheme.startDate || "N/A"}</span>
            </div>
          </div>

          {/* Description */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Info size={16} />
              About This Scheme
            </h3>
            <p className={styles.text}>{scheme.description}</p>
          </section>

          {/* Eligibility */}
          {scheme.eligibilityCriteria && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <CheckCircle2 size={16} />
                Eligibility Criteria
              </h3>
              <p className={styles.text}>{scheme.eligibilityCriteria}</p>
            </section>
          )}

          {/* Benefits */}
          {scheme.benefits && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <IndianRupee size={16} />
                Benefits
              </h3>
              <p className={styles.text}>{scheme.benefits}</p>
            </section>
          )}

          {/* How to Apply */}
          {scheme.applicationProcess && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <ClipboardCheck size={16} />
                How to Apply
              </h3>
              <p className={styles.text}>{scheme.applicationProcess}</p>
            </section>
          )}

          {/* Documents */}
          {scheme.documentsRequired?.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FileText size={16} />
                Documents Required
              </h3>
              <ul className={styles.docList}>
                {scheme.documentsRequired.map((doc, i) => (
                  <li key={i} className={styles.docItem}>{doc}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Video size={16} color="#dc2626" />
            Watch Help Video
          </a>
          {!expired && (
            <button className="btn btn-primary">
              Apply Now
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
