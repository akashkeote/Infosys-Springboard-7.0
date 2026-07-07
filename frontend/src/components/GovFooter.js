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
    name: "Digital India",
    img: "https://www.digitalindia.gov.in/content/images/di_logo.svg",
    fallback: "🇮🇳",
    href: "https://www.digitalindia.gov.in",
  },
  {
    name: "NIC",
    img: "https://www.nic.in/wp-content/uploads/2022/02/NIC-logo.png",
    fallback: "🏛️",
    href: "https://www.nic.in",
  },
  {
    name: "UMANG",
    img: "https://web.umang.gov.in/web_new/assets/img/umang_logo.png",
    fallback: "📱",
    href: "https://web.umang.gov.in",
  },
  {
    name: "MyScheme",
    img: "https://www.myscheme.gov.in/images/my_scheme_logo.png",
    fallback: "📋",
    href: "https://www.myscheme.gov.in",
  },
  {
    name: "DBT Bharat",
    img: "https://dbtbharat.gov.in/assets/images/dbtBharatLogo.png",
    fallback: "💰",
    href: "https://dbtbharat.gov.in",
  },
  {
    name: "Aadhaar",
    img: "https://uidai.gov.in/images/aadhaar_logo.png",
    fallback: "🪪",
    href: "https://uidai.gov.in",
  },
  {
    name: "PFMS",
    img: "https://pfms.nic.in/NewDefaultsite/images/logo.png",
    fallback: "🏦",
    href: "https://pfms.nic.in",
  },
  {
    name: "India.gov.in",
    img: "https://india.gov.in/sites/upload_files/npi/files/india-logo-new.png",
    fallback: "🌐",
    href: "https://india.gov.in",
  },
  {
    name: "myGov",
    img: "https://www.mygov.in/sites/default/files/mygov_logo.png",
    fallback: "🗳️",
    href: "https://www.mygov.in",
  },
  {
    name: "MeitY",
    img: "https://www.meity.gov.in/assets/images/meity-new-logo.jpg",
    fallback: "⚙️",
    href: "https://www.meity.gov.in",
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
      <img
        src={logo.img}
        alt={logo.name}
        height={22}
        style={{ maxWidth: 80, objectFit: "contain", filter: "grayscale(30%)" }}
        onError={(e) => {
          /* replace broken img with emoji fallback */
          const span = document.createElement("span");
          span.textContent = logo.fallback;
          span.style.fontSize = "18px";
          e.target.parentNode.replaceChild(span, e.target);
        }}
      />
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
