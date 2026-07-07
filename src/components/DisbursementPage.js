"use client";

import { useState } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  BarChart3,
  User,
  MapPin,
  X,
  CreditCard,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { DEMO_DISBURSEMENTS, STATUS_CONFIG } from "@/lib/demoData";
import styles from "./DisbursementPage.module.css";

export default function DisbursementPage({ user }) {
  const [selected, setSelected] = useState(null);
  const isOfficer = user?.role === "officer";
  const isVLE = user?.role === "vle";

  const totalDisbursed = DEMO_DISBURSEMENTS.reduce((s, d) => s + d.disbursedAmount, 0);
  const totalPending = DEMO_DISBURSEMENTS.reduce((s, d) => s + d.pendingAmount, 0);
  const totalAmount = DEMO_DISBURSEMENTS.reduce((s, d) => s + d.totalAmount, 0);

  return (
    <div className={styles.container}>
      {/* Fund Summary Stats */}
      <div className={styles.fundStats}>
        <div className={styles.fundCard} style={{ "--fc": "#7c3aed" }}>
          <div className={styles.fundIconWrap} style={{ background: "#ede9fe" }}>
            <IndianRupee size={20} color="#7c3aed" />
          </div>
          <div>
            <span className={styles.fundValue}>₹{(totalAmount / 1000).toFixed(1)}K</span>
            <span className={styles.fundLabel}>Total Sanctioned</span>
          </div>
        </div>
        <div className={styles.fundCard} style={{ "--fc": "#16a34a" }}>
          <div className={styles.fundIconWrap} style={{ background: "#dcfce7" }}>
            <CheckCircle2 size={20} color="#16a34a" />
          </div>
          <div>
            <span className={styles.fundValue}>₹{(totalDisbursed / 1000).toFixed(1)}K</span>
            <span className={styles.fundLabel}>Disbursed</span>
          </div>
        </div>
        <div className={styles.fundCard} style={{ "--fc": "#d97706" }}>
          <div className={styles.fundIconWrap} style={{ background: "#fef3c7" }}>
            <Clock size={20} color="#d97706" />
          </div>
          <div>
            <span className={styles.fundValue}>₹{(totalPending / 1000).toFixed(1)}K</span>
            <span className={styles.fundLabel}>Pending</span>
          </div>
        </div>
        <div className={styles.fundCard} style={{ "--fc": "#0891b2" }}>
          <div className={styles.fundIconWrap} style={{ background: "#ecfeff" }}>
            <BarChart3 size={20} color="#0891b2" />
          </div>
          <div>
            <span className={styles.fundValue}>{totalAmount > 0 ? Math.round((totalDisbursed / totalAmount) * 100) : 0}%</span>
            <span className={styles.fundLabel}>Utilization Rate</span>
          </div>
        </div>
      </div>

      {/* Role context */}
      <div className={styles.roleBar}>
        <div className={styles.roleBadge}>
          <ShieldCheck size={14} />
          <span>Viewing as: <strong>{isOfficer ? "Sanctioning Officer" : isVLE ? "VLE Operator" : "Beneficiary"}</strong></span>
        </div>
        {isOfficer && (
          <span className={styles.roleBadgeSub}>You can release pending installments</span>
        )}
      </div>

      {/* Disbursement Records */}
      <h2 className={styles.sectionTitle}>Disbursement Records</h2>

      <div className={styles.list}>
        {DEMO_DISBURSEMENTS.map((disb, i) => {
          const sc = STATUS_CONFIG[disb.status] || {};
          const progress = disb.totalAmount > 0 ? (disb.disbursedAmount / disb.totalAmount) * 100 : 0;

          return (
            <div
              key={disb.id}
              className={styles.card}
              onClick={() => setSelected(disb)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <span className={styles.disbId}>{disb.id}</span>
                  <h3 className={styles.cardTitle}>{disb.scheme}</h3>
                  <span className={styles.cardBeneficiary}>
                    <User size={12} /> {disb.beneficiary} <MapPin size={12} style={{ marginLeft: 6 }} /> {disb.state}
                  </span>
                </div>
                <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>
              </div>

              {/* Fund Progress */}
              <div className={styles.fundProgress}>
                <div className={styles.progressHeader}>
                  <span>₹{disb.disbursedAmount.toLocaleString()} of ₹{disb.totalAmount.toLocaleString()}</span>
                  <span className={styles.progressPct}>{Math.round(progress)}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Milestones preview */}
              <div className={styles.milestonePreview}>
                {disb.milestones.map((m, j) => (
                  <div key={j} className={`${styles.mileDot} ${m.completed ? styles.mileDone : ""}`} title={m.name}>
                    {m.completed ? "✓" : ""}
                  </div>
                ))}
                <span className={styles.mileText}>
                  {disb.milestones.filter(m => m.completed).length}/{disb.milestones.length} milestones
                </span>
              </div>

              <div className={styles.cardFooter}>
                <span>{disb.installments.length} installment{disb.installments.length > 1 ? "s" : ""}</span>
                <span className={styles.viewArrow}>View Details <ArrowRight size={12} /></span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <DisbursementDetailModal disb={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ─── Disbursement Detail Modal ─── */
function DisbursementDetailModal({ disb, onClose }) {
  const sc = STATUS_CONFIG[disb.status] || {};
  const progress = disb.totalAmount > 0 ? (disb.disbursedAmount / disb.totalAmount) * 100 : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.disbId}>{disb.id} • {disb.applicationId}</span>
            <h2 className={styles.modalTitle}>{disb.scheme}</h2>
            <span className={styles.cardBeneficiary}>
              <User size={12} /> {disb.beneficiary} <MapPin size={12} style={{ marginLeft: 6 }} /> {disb.state}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Fund Summary */}
          <div className={styles.fundSummary}>
            <div className={styles.fundSumItem}>
              <span className={styles.fundSumLabel}>Sanctioned</span>
              <span className={styles.fundSumValue}>₹{disb.totalAmount.toLocaleString()}</span>
            </div>
            <div className={styles.fundSumItem}>
              <span className={styles.fundSumLabel}>Disbursed</span>
              <span className={styles.fundSumValue} style={{ color: "#16a34a" }}>₹{disb.disbursedAmount.toLocaleString()}</span>
            </div>
            <div className={styles.fundSumItem}>
              <span className={styles.fundSumLabel}>Pending</span>
              <span className={styles.fundSumValue} style={{ color: "#d97706" }}>₹{disb.pendingAmount.toLocaleString()}</span>
            </div>
            <div className={styles.fundSumItem}>
              <span className={styles.fundSumLabel}>Progress</span>
              <span className={styles.fundSumValue} style={{ color: "var(--primary-600)" }}>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Installment Table */}
          <h3 className={styles.subTitle}><CreditCard size={16} /> Installment Releases</h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>#</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Status</span>
              <span>Txn ID</span>
              <span>Mode</span>
            </div>
            {disb.installments.map((inst) => {
              const instSc = STATUS_CONFIG[inst.status] || {};
              return (
                <div key={inst.no} className={styles.tableRow}>
                  <span className={styles.cellBold}>{inst.no}</span>
                  <span className={styles.cellBold}>₹{inst.amount.toLocaleString()}</span>
                  <span>{inst.date || "—"}</span>
                  <span>
                    <span className={styles.statusBadge} style={{ background: instSc.bg, color: instSc.color, fontSize: 10 }}>
                      {instSc.label}
                    </span>
                  </span>
                  <span className={styles.cellMono}>{inst.txnId || "—"}</span>
                  <span>{inst.mode}</span>
                </div>
              );
            })}
          </div>

          {/* Compliance Milestones */}
          <h3 className={styles.subTitle}><ClipboardList size={16} /> Compliance Milestones</h3>
          <div className={styles.milestoneList}>
            {disb.milestones.map((m, i) => (
              <div key={i} className={`${styles.milestone} ${m.completed ? styles.milestoneDone : ""}`}>
                <div className={`${styles.mileCheck} ${m.completed ? styles.mileCheckDone : ""}`}>
                  {m.completed ? "✓" : ""}
                </div>
                <div className={styles.mileInfo}>
                  <span className={styles.mileName}>{m.name}</span>
                  {m.date && <span className={styles.mileDate}>{m.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
