"use client";

import {
  Globe,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  Smartphone,
  CreditCard,
  FileSearch,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Wheat,
  Users,
  Heart,
  Building2,
  GraduationCap,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import styles from "./DashboardSections.module.css";

/* ─── Quick Links Data ─── */
const QUICK_LINKS = [
  { name: "MyScheme", desc: "Find all government schemes", url: "https://myscheme.gov.in", Icon: Globe },
  { name: "Digital India", desc: "Digital services portal", url: "https://digitalindia.gov.in", Icon: Smartphone },
  { name: "PFMS", desc: "Public Financial Management", url: "https://pfms.nic.in", Icon: CreditCard },
  { name: "RTI Portal", desc: "Right to Information", url: "https://rtionline.gov.in", Icon: FileSearch },
  { name: "DBT Bharat", desc: "Direct Benefit Transfer", url: "https://dbtbharat.gov.in", Icon: ShieldCheck },
  { name: "India.gov.in", desc: "National Portal of India", url: "https://india.gov.in", Icon: BookOpen },
];

/* ─── Fraud Alerts Data ─── */
const FRAUD_ALERTS = [
  {
    title: "Advisory: Fake PM-KISAN registration portals detected",
    severity: "high",
    date: "2026-07-02",
    desc: "Multiple phishing websites mimicking the PM-KISAN portal have been identified. Beneficiaries are advised to use only the official portal pmkisan.gov.in.",
  },
  {
    title: "Warning: Fraudulent calls demanding Aadhaar OTP for scheme enrollment",
    severity: "high",
    date: "2026-06-28",
    desc: "No government officer will ever ask for your Aadhaar OTP over phone. Report such calls to 1930 (Cyber Crime Helpline).",
  },
  {
    title: "Alert: Duplicate beneficiaries detected in PMAY-Gramin, 3 districts",
    severity: "medium",
    date: "2026-06-25",
    desc: "SECC verification audit flagged 47 duplicate entries in Indore, Jaipur, and Patna districts. Verification officers have been notified.",
  },
  {
    title: "Advisory: Fund utilization anomaly in Skill India disbursements",
    severity: "medium",
    date: "2026-06-20",
    desc: "Training providers in 2 states show < 40% trainee completion rate despite full fund drawdown. Investigation initiated.",
  },
  {
    title: "Notice: Ladli Behna Yojana — ineligible beneficiary removal drive",
    severity: "low",
    date: "2026-06-15",
    desc: "Income re-verification drive identified 1,200+ ineligible beneficiaries. Recovery process initiated for ₹96L disbursed amount.",
  },
];

/* ─── FAQ Data ─── */
const FAQ_DATA = [
  {
    q: "How do I check if I'm eligible for a government scheme?",
    a: "Use the 'All Schemes' tab to browse or search for schemes by category, state, or keyword. Each scheme page shows detailed eligibility criteria including income limits, age requirements, and required documents.",
  },
  {
    q: "How is fund disbursement tracked?",
    a: "Every disbursement is tracked with UTR/Transaction IDs via DBT (Direct Benefit Transfer). The 'Disbursement' module shows installment-wise tracking, compliance milestones, and real-time fund utilization rates.",
  },
  {
    q: "What happens if my application is rejected?",
    a: "The rejection reason with the reviewing officer's name and designation is recorded in the system. You can view this in the 'Applications' tab. You may reapply after addressing the stated issues.",
  },
  {
    q: "How does the system prevent fund misuse?",
    a: "The system uses multi-stage officer verification (6 levels), Aadhaar-based beneficiary deduplication, CIBIL score checks for loan schemes, and automated anomaly detection for fund utilization patterns.",
  },
  {
    q: "Who are the different types of users in this system?",
    a: "Three roles: Citizens (beneficiaries who apply for schemes), VLE Operators (Village Level Entrepreneurs at CSC centers who assist citizens), and Government Officers (who verify, approve, and sanction applications at various levels).",
  },
];

/* ─── Quick Links Section ─── */
export function QuickLinksSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <Globe size={18} />
        Quick Links
      </h2>
      <div className={styles.quickGrid}>
        {QUICK_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.quickCard}
          >
            <div className={styles.quickIcon}>
              <link.Icon size={22} strokeWidth={1.6} />
            </div>
            <div className={styles.quickInfo}>
              <span className={styles.quickName}>{link.name}</span>
              <span className={styles.quickDesc}>{link.desc}</span>
            </div>
            <ExternalLink size={14} className={styles.quickArrow} />
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── Fraud Alerts Section ─── */
export function FraudAlertsSection() {
  const SEVERITY_STYLES = {
    high: { bg: "#fee2e2", color: "#dc2626", label: "High" },
    medium: { bg: "#fef3c7", color: "#d97706", label: "Medium" },
    low: { bg: "#ecfeff", color: "#0891b2", label: "Low" },
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <h2 className={styles.sectionTitle}>
          <AlertTriangle size={18} />
          Fraud Alerts & Fund Misuse Tracking
        </h2>
        <span className={styles.alertCount}>
          {FRAUD_ALERTS.filter((a) => a.severity === "high").length} critical
        </span>
      </div>
      <div className={styles.alertList}>
        {FRAUD_ALERTS.map((alert, i) => {
          const sev = SEVERITY_STYLES[alert.severity];
          return (
            <div key={i} className={styles.alertItem}>
              <div className={styles.alertLeft}>
                <AlertTriangle size={16} color={sev.color} />
              </div>
              <div className={styles.alertBody}>
                <div className={styles.alertHeader}>
                  <span className={styles.alertTitle}>{alert.title}</span>
                  <span
                    className={styles.alertBadge}
                    style={{ background: sev.bg, color: sev.color }}
                  >
                    {sev.label}
                  </span>
                </div>
                <p className={styles.alertDesc}>{alert.desc}</p>
                <span className={styles.alertDate}>{alert.date}</span>
              </div>
              <ChevronRight size={16} className={styles.alertArrow} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <HelpCircle size={18} />
        Frequently Asked Questions
      </h2>
      <div className={styles.faqList}>
        {FAQ_DATA.map((faq, i) => (
          <div
            key={i}
            className={`${styles.faqItem} ${openIndex === i ? styles.faqOpen : ""}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{faq.q}</span>
              <ChevronDown size={16} className={styles.faqChevron} />
            </button>
            {openIndex === i && (
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── UMANG-style 3D Flip Category Cards ─── */
const SCHEME_CATEGORIES = [
  {
    Icon: Wheat,
    name: "Agriculture",
    nameHi: "कृषि",
    count: "1,240+",
    desc: "PM-KISAN, Soil Health Card, Kisan Credit Card, PMFBY crop insurance and more",
    color: "#15803d",
    bgLight: "#dcfce7",
  },
  {
    Icon: Heart,
    name: "Women & Child",
    nameHi: "महिला एवं बाल",
    count: "680+",
    desc: "Ladli Behna, Ujjwala Yojana, Sukanya Samriddhi, Beti Bachao Beti Padhao",
    color: "#be185d",
    bgLight: "#fce7f3",
  },
  {
    Icon: GraduationCap,
    name: "Education",
    nameHi: "शिक्षा",
    count: "520+",
    desc: "National Scholarships, PM VIDYA, Mid-Day Meal, Samagra Shiksha Abhiyan",
    color: "#1d4ed8",
    bgLight: "#dbeafe",
  },
  {
    Icon: Building2,
    name: "Housing",
    nameHi: "आवास",
    count: "340+",
    desc: "PMAY Urban & Gramin, Affordable Rental Housing, Rajiv Awas Yojana",
    color: "#b45309",
    bgLight: "#fef3c7",
  },
  {
    Icon: Users,
    name: "Social Welfare",
    nameHi: "सामाजिक कल्याण",
    count: "890+",
    desc: "NSAP Pensions, Divyangjan, SC/ST scholarships, minority welfare schemes",
    color: "#7c3aed",
    bgLight: "#ede9fe",
  },
  {
    Icon: Leaf,
    name: "Environment",
    nameHi: "पर्यावरण",
    count: "210+",
    desc: "Solar rooftop, PM KUSUM, Green India Mission, Jal Jeevan Mission",
    color: "#0891b2",
    bgLight: "#cffafe",
  },
];

export function CategoryFlipCards() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <Globe size={18} />
        Browse by Scheme Category
        <span className={styles.sectionSubTag}>Hover to explore</span>
      </h2>
      <div className={styles.flipGrid}>
        {SCHEME_CATEGORIES.map((cat) => (
          <div key={cat.name} className={styles.flipCol}>
            <div className={styles.flipCard}>
              {/* Front */}
              <div className={styles.flipFront}>
                <div
                  className={styles.flipIconWrap}
                  style={{ background: cat.bgLight, color: cat.color }}
                >
                  <cat.Icon size={28} strokeWidth={1.5} />
                </div>
                <div className={styles.flipFrontBody}>
                  <h4 className={styles.flipName}>{cat.name}</h4>
                  <p className={styles.flipNameHi}>{cat.nameHi}</p>
                  <span className={styles.flipCount} style={{ color: cat.color }}>
                    {cat.count} schemes
                  </span>
                </div>
                <ArrowRight size={14} className={styles.flipArrow} />
              </div>
              {/* Back — revealed on hover (UMANG flip card) */}
              <div
                className={styles.flipBack}
                style={{ background: cat.color }}
              >
                <div className={styles.flipBackInner}>
                  <cat.Icon size={22} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
                  <h4 className={styles.flipBackName}>{cat.name}</h4>
                  <p className={styles.flipBackDesc}>{cat.desc}</p>
                  <span className={styles.flipBackCount}>{cat.count} schemes available</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
