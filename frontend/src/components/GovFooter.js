"use client";

import styles from "./GovFooter.module.css";

/* ─── Inline SVG brand marks matching UX4G 3.0 footer pattern ─── */
const DigitalIndiaLogo = () => (
  <svg width="20" height="16" viewBox="0 0 32 24" fill="none">
    <circle cx="6" cy="12" r="3" fill="var(--primary-500)" />
    <path d="M10 12C10 7.58 13.58 4 18 4s8 3.58 8 8-3.58 8-8 8" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M14 12c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const NICLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="var(--primary-600)" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 22V12M3 7l9 5 9-5" stroke="var(--primary-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GovInLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="var(--primary-500)" strokeWidth="1.8" />
    <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--primary-600)" fontFamily="Outfit, sans-serif">@</text>
  </svg>
);

const AadhaarLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="var(--primary-500)" strokeWidth="1.8" />
    <circle cx="8" cy="12" r="2.5" stroke="var(--primary-400)" strokeWidth="1.5" />
    <path d="M14 9h5M14 12h4M14 15h3" stroke="var(--primary-500)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UPILogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 4l4 16" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 4l4 16" stroke="var(--primary-400)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 4v16" stroke="var(--primary-600)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MyGovLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--primary-500)" strokeWidth="1.8" />
    <path d="M12 6v4l3 3" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1.5" fill="var(--primary-500)" />
  </svg>
);

const DISHALogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--primary-500)" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GOV_LOGOS = [
  { name: "Digital India", Logo: DigitalIndiaLogo },
  { name: "NIC", Logo: NICLogo },
  { name: "gov.in", Logo: GovInLogo },
  { name: "Aadhaar", Logo: AadhaarLogo },
  { name: "UPI", Logo: UPILogo },
  { name: "myGov", Logo: MyGovLogo },
  { name: "DISHA", Logo: DISHALogo },
];

export default function GovFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoStrip}>
        {GOV_LOGOS.map((logo) => (
          <div key={logo.name} className={styles.logoItem}>
            <logo.Logo />
            <span className={styles.logoName}>{logo.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.tricolor}>
        <div className={styles.triSaffron} />
        <div className={styles.triWhite} />
        <div className={styles.triGreen} />
      </div>

      <div className={styles.info}>
        <p className={styles.infoText}>
          © 2026 GovGrant Tracker — Government Subsidy & Grant Disbursement Tracking System
        </p>
        <p className={styles.infoSub}>
          Built with UX4G Design System 3.0 • Infosys Springboard Internship 7.0
        </p>
        <div className={styles.links}>
          <a href="#">Terms of Use</a>
          <span>•</span>
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Accessibility</a>
          <span>•</span>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
