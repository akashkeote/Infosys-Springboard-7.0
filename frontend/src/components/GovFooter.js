"use client";

import styles from "./GovFooter.module.css";

/**
 * GovFooter — UMANG-style footer with:
 *  1. Infinite horizontal marquee of government partner logos
 *  2. Indian tricolour bar
 *  3. Info / links section
 */

/* Real government portal logo images + fallback SVG colours */
const GOV_LOGOS = [
  {
    name: "UMANG",
    img: "https://web.umang.gov.in/web_new/assets/img/UMANG_logo.png",
    fallback: "📱", color: "#FF6B35",
    href: "https://web.umang.gov.in",
  },
  {
    name: "MyScheme",
    img: "https://www.myscheme.gov.in/favicon.ico",
    fallback: "📋", color: "#1a56db",
    href: "https://www.myscheme.gov.in",
  },
  {
    name: "DBT Bharat",
    img: "https://dbtbharat.gov.in/site/assets/images/favicon.png",
    fallback: "💰", color: "#138808",
    href: "https://dbtbharat.gov.in",
  },
  {
    name: "Aadhaar",
    img: "https://uidai.gov.in/favicon.ico",
    fallback: "🪪", color: "#003580",
    href: "https://uidai.gov.in",
  },
  {
    name: "PFMS",
    img: "https://pfms.nic.in/NewDefaultsite/pfms/img/favicon.ico",
    fallback: "🏦", color: "#1a3c6e",
    href: "https://pfms.nic.in",
  },
  {
    name: "India.gov.in",
    img: "https://www.india.gov.in/sites/upload_files/npi/files/favicon_0.ico",
    fallback: "🌐", color: "#1a3c6e",
    href: "https://india.gov.in",
  },
  {
    name: "myGov",
    img: "https://www.mygov.in/sites/all/themes/mygov/images/favicon.ico",
    fallback: "🗳️", color: "#FF6600",
    href: "https://www.mygov.in",
  },
  {
    name: "MeitY",
    img: "https://www.meity.gov.in/sites/all/themes/meity/images/favicon.ico",
    fallback: "⚙️", color: "#0f6fbe",
    href: "https://www.meity.gov.in",
  },
  {
    name: "NIC",
    img: "https://www.nic.in/wp-content/uploads/2020/09/cropped-nic-favicon-32x32.png",
    fallback: "🏛️", color: "#003580",
    href: "https://www.nic.in",
  },
  {
    name: "Digital India",
    img: "https://digitalindia.gov.in/wp-content/uploads/2023/07/cropped-DI-Logo-32x32.jpg",
    fallback: "🇮🇳", color: "#0f6fbe",
    href: "https://digitalindia.gov.in",
  },
];

/* Single logo item */
function LogoItem({ logo }) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.logoItem}
      title={logo.name}
    >
      <span
        className={styles.logoIconWrap}
        style={{ background: logo.color + "18", border: `1.5px solid ${logo.color}30` }}
      >
        <img
          src={logo.img}
          alt={logo.name}
          width={20}
          height={20}
          style={{ objectFit: "contain", borderRadius: 3 }}
          onError={(e) => {
            e.target.style.display = "none";
            const fb = e.target.nextSibling;
            if (fb) fb.style.display = "block";
          }}
        />
        <span style={{ display: "none", fontSize: 16 }}>{logo.fallback}</span>
      </span>
      <span className={styles.logoName}>{logo.name}</span>
    </a>
  );
}

export default function GovFooter() {
  // Duplicate the list twice — seamless marquee loop
  const doubled = [...GOV_LOGOS, ...GOV_LOGOS];

  return (
    <footer className={styles.footer}>
      {/* ── Infinite marquee ── */}
      <div className={styles.logoTrack} aria-label="Government partner portals">
        <div className={styles.logoInner}>
          {doubled.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} logo={logo} />
          ))}
        </div>
      </div>

      {/* ── Indian tricolour ── */}
      <div className={styles.tricolor}>
        <div className={styles.triSaffron} />
        <div className={styles.triWhite} />
        <div className={styles.triGreen} />
      </div>

      {/* ── Info ── */}
      <div className={styles.info}>
        <p className={styles.infoText}>
          © 2026 GovGrant Tracker — Government Subsidy &amp; Grant Disbursement Tracking System
        </p>
        <p className={styles.infoSub}>
          Built with UX4G Design System 3.0 &bull; Infosys Springboard Virtual Internship 7.0
        </p>
        <div className={styles.links}>
          <a href="#">Terms of Use</a>
          <span>•</span>
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Accessibility</a>
          <span>•</span>
          <a href="https://web.umang.gov.in" target="_blank" rel="noopener noreferrer">
            UMANG Portal
          </a>
          <span>•</span>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
