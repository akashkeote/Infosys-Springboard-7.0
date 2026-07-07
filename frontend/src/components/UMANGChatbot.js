"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./UMANGChatbot.module.css";

/**
 * UMANGChatbot — Floating AI assistant widget.
 *
 * Design:  UX4G Purple (matches our app's --primary-500 / #7c3aed)
 * Backend: UMANG's real chatbot iframe (chatbot.umangapp.in)
 *
 * Protocol sourced from UMANG DOM scrape (Login.html):
 *   open  → postMessage { action: "handelOpeningBot" }
 *   close ← postMessage { action: "handelCloseBotModal" }
 */
export default function UMANGChatbot() {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef(null);

  /* Close signal from the chatbot iframe */
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.action === "handelCloseBotModal") setOpen(false);
      if (e.data?.action === "openLink" && e.data?.url) {
        window.location.href = e.data.url;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const openChat = () => {
    setOpen(true);
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { action: "handelOpeningBot" }, "*"
      );
    }, 350);
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      {!open && (
        <button
          id="chatbot-button"
          className={styles.trigger}
          onClick={openChat}
          aria-label="Open UMANG AI Assistant"
          title="Ask UMANG AI"
        >
          <img
            src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png"
            alt="UMANG AI"
            className={styles.triggerIcon}
            onError={(e) => {
              e.target.style.display = "none";
              const fb = e.target.nextSibling;
              if (fb) fb.style.display = "flex";
            }}
          />
          <span className={styles.triggerFallback}>🤖</span>
          <span className={styles.triggerLabel}>Ask UMANG AI</span>
        </button>
      )}

      {/* ── Chat window ── */}
      <div
        id="chatbot-window"
        className={`${styles.window} ${open ? styles.windowOpen : ""}`}
        aria-hidden={!open}
        aria-label="UMANG AI Chat"
      >
        {/* Purple UX4G header */}
        <div className={styles.windowHeader}>
          <div className={styles.windowBrand}>
            <img
              src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png"
              alt="UMANG"
              className={styles.brandIcon}
              width={26}
              height={26}
            />
            <span>GovGrant AI Assistant</span>
            <span className={styles.brandPill}>UMANG</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* "Powered by" attribution strip */}
        <div className={styles.poweredBy}>
          <span className={styles.poweredByDot} />
          Powered by UMANG AI &bull; Government of India
          <span className={styles.poweredByDot} />
        </div>

        {/* UMANG chatbot iframe — clipped to hide their blue header bar */}
        {open && (
          <div className={styles.iframeWrap}>
            <iframe
              ref={iframeRef}
              id="chatbot-iframe"
              src="https://chatbot.umangapp.in/"
              title="UMANG AI Chatbot"
              className={styles.iframe}
              allow="clipboard-write; microphone"
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}
      </div>
    </>
  );
}
