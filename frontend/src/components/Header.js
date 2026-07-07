"use client";

import { RefreshCw, Bell, Sun, Moon, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useLang, LANGS } from "@/lib/i18n";

export default function Header({ title, subtitle, onSync, isSyncing }) {
  const { lang, setLang, t } = useLang();
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectedLang = LANGS.find((l) => l.code === lang) || LANGS[0];

  // Apply theme — UMANG pattern: data-theme on html element
  useEffect(() => {
    const stored = localStorage.getItem("govgrant-theme");
    if (stored === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("govgrant-theme", next ? "dark" : "light");
  };

  // Font size — UMANG style A- A A+
  const applyFontSize = (size) => {
    setFontSize(size);
    const map = { small: "14px", normal: "16px", large: "18px" };
    document.documentElement.style.fontSize = map[size];
  };

  return (
    <>
      {/* Government of India Top Strip — UMANG-style */}
      <div className={styles.govBar}>
        <div className={styles.govBarInner}>
          {/* Left: Flag + Title + Logos */}
          <div className={styles.govLeft}>
            <div className={styles.flagIcon}>
              <span className={styles.fSaffron} />
              <span className={styles.fWhite} />
              <span className={styles.fGreen} />
            </div>
            <span className={styles.govText}>भारत सरकार | Government of India</span>
          </div>

          {/* Right: Accessibility + Lang + Theme */}
          <div className={styles.govRight}>
            <a href="#main-content" className={styles.govLink}>Screen Reader</a>
            <span className={styles.govDivider}>|</span>

            {/* Font Size UMANG-style A- A A+ */}
            <div className={styles.fontGroup}>
              <button
                className={`${styles.fontBtn} ${fontSize === "small" ? styles.fontBtnActive : ""}`}
                onClick={() => applyFontSize("small")}
                aria-label="Decrease font size"
              >A-</button>
              <button
                className={`${styles.fontBtn} ${fontSize === "normal" ? styles.fontBtnActive : ""}`}
                onClick={() => applyFontSize("normal")}
                aria-label="Normal font size"
              >A</button>
              <button
                className={`${styles.fontBtn} ${fontSize === "large" ? styles.fontBtnActive : ""}`}
                onClick={() => applyFontSize("large")}
                aria-label="Increase font size"
              >A+</button>
            </div>

            <span className={styles.govDivider}>|</span>

            {/* Language Selector — UMANG style */}
            <div className={styles.langWrap}>
              <button
                className={styles.langBtn}
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label="Select language"
              >
                <Languages size={13} />
                <span>{selectedLang.native}</span>
              </button>
              {showLangMenu && (
                <div className={styles.langMenu}>
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      className={`${styles.langItem} ${selectedLang.code === l.code ? styles.langItemActive : ""}`}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className={styles.govDivider}>|</span>

            {/* Dark/Light Theme Toggle — UMANG's theme-switcher */}
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className={styles.header} id="main-content">
        <div className={styles.left}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        <div className={styles.right}>
          {onSync && (
            <button
              className={`btn btn-outline btn-sm ${styles.syncBtn}`}
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? <span className="spinner" /> : <RefreshCw size={14} />}
              Sync
            </button>
          )}
          <button className={`btn-icon ${styles.iconBtn}`} aria-label="Notifications">
            <Bell size={18} />
            <span className={styles.notifDot} />
          </button>
        </div>
      </header>
    </>
  );
}
