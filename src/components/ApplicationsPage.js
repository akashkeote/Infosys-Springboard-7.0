"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  X,
  ClipboardCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  ShieldCheck,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import { DEMO_APPLICATIONS, WORKFLOW_STAGES, STATUS_CONFIG } from "@/lib/demoData";
import styles from "./ApplicationsPage.module.css";

const STATUS_FILTERS = ["All", "submitted", "in_progress", "approved", "rejected"];

const STATUS_ICONS = {
  approved: CheckCircle2,
  rejected: XCircle,
  in_progress: Clock,
  submitted: Send,
};

export default function ApplicationsPage({ user }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { app, action: 'approve'|'reject' }
  const [actionReason, setActionReason] = useState("");

  const isOfficer = user?.role === "officer";
  const isVLE = user?.role === "vle";
  const isCitizen = user?.role === "citizen";

  const filtered =
    filter === "All"
      ? DEMO_APPLICATIONS
      : DEMO_APPLICATIONS.filter((a) => a.status === filter);

  const handleAction = (app, action) => {
    setActionModal({ app, action });
    setActionReason("");
  };

  const confirmAction = () => {
    // In real system: API call to approve/reject with reason
    alert(`${actionModal.action === "approve" ? "Approved" : "Rejected"}: ${actionModal.app.id}\nReason: ${actionReason || "No remarks"}`);
    setActionModal(null);
    setActionReason("");
  };

  return (
    <div className={styles.container}>
      {/* Role Badge */}
      <div className={styles.roleBar}>
        <div className={styles.roleBadge}>
          <ShieldCheck size={14} />
          <span>Viewing as: <strong>{isOfficer ? "Government Officer" : isVLE ? "VLE Operator" : "Citizen"}</strong></span>
        </div>
        {isVLE && (
          <button className="btn btn-primary btn-sm">
            <UserPlus size={14} />
            Submit New Application (On Behalf)
          </button>
        )}
      </div>

      {/* Stats summary */}
      <div className={styles.statsRow}>
        {[
          { label: "Total", count: DEMO_APPLICATIONS.length, color: "#7c3aed" },
          { label: "Approved", count: DEMO_APPLICATIONS.filter((a) => a.status === "approved").length, color: "#16a34a" },
          { label: "In Progress", count: DEMO_APPLICATIONS.filter((a) => a.status === "in_progress").length, color: "#d97706" },
          { label: "Rejected", count: DEMO_APPLICATIONS.filter((a) => a.status === "rejected").length, color: "#dc2626" },
          { label: "Submitted", count: DEMO_APPLICATIONS.filter((a) => a.status === "submitted").length, color: "#0891b2" },
        ].map((s) => (
          <div key={s.label} className={styles.statChip} style={{ "--chip-color": s.color }}>
            <span className={styles.statCount}>{s.count}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.activeTab : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" ? "All Applications" : STATUS_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {/* Application Cards */}
      <div className={styles.list}>
        {filtered.map((app, i) => {
          const statusConf = STATUS_CONFIG[app.status] || {};
          const StatusIcon = STATUS_ICONS[app.status] || Clock;
          return (
            <div
              key={app.id}
              className={styles.card}
              onClick={() => setSelected(app)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={styles.cardLeft}>
                <div className={styles.progressRing}>
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border-light)" strokeWidth="3" />
                    <circle
                      cx="26" cy="26" r="22" fill="none"
                      stroke={statusConf.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(app.currentStage / 6) * 138} 138`}
                      transform="rotate(-90 26 26)"
                    />
                  </svg>
                  <span className={styles.ringText} style={{ color: statusConf.color }}>
                    {app.currentStage}/6
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.appId}>{app.id}</span>
                  <span
                    className={styles.statusBadge}
                    style={{ background: statusConf.bg, color: statusConf.color }}
                  >
                    <StatusIcon size={12} /> {statusConf.label}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{app.schemeName}</h3>
                <div className={styles.cardMeta}>
                  <span><User size={12} /> {app.applicantName}</span>
                  <span><MapPin size={12} /> {app.district}, {app.state}</span>
                  <span><Calendar size={12} /> {app.appliedDate}</span>
                </div>

                {/* Mini workflow bar */}
                <div className={styles.miniWorkflow}>
                  {WORKFLOW_STAGES.map((ws) => {
                    const stageData = app.stages.find((s) => s.stage === ws.id);
                    const stStatus = stageData?.status || "pending";
                    return (
                      <div key={ws.id} className={styles.miniStep}>
                        <div
                          className={`${styles.miniDot} ${styles[`dot_${stStatus}`]}`}
                          title={`${ws.name}: ${stStatus}`}
                        />
                        {ws.id < 6 && (
                          <div className={`${styles.miniLine} ${stStatus === "completed" ? styles.lineComplete : ""}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {app.status === "rejected" && app.rejectionReason && (
                  <div className={styles.rejectionPreview}>
                    <AlertTriangle size={12} /> <strong>Rejection:</strong> {app.rejectionReason.substring(0, 100)}...
                  </div>
                )}

                {/* Officer action buttons — only visible for officers on pending applications */}
                {isOfficer && (app.status === "submitted" || app.status === "in_progress") && (
                  <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                    <button
                      className={styles.approveBtn}
                      onClick={(e) => { e.stopPropagation(); handleAction(app, "approve"); }}
                    >
                      <ThumbsUp size={12} /> Approve
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={(e) => { e.stopPropagation(); handleAction(app, "reject"); }}
                    >
                      <ThumbsDown size={12} /> Reject
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.cardRight}>
                <span className={styles.amount}>{app.amount}</span>
                <div className={styles.scoreBar}>
                  <span className={styles.scoreLabel}>Eligibility</span>
                  <div className={styles.scoreMeter}>
                    <div
                      className={styles.scoreFill}
                      style={{
                        width: `${app.eligibilityScore}%`,
                        background:
                          app.eligibilityScore >= 80
                            ? "#16a34a"
                            : app.eligibilityScore >= 50
                            ? "#d97706"
                            : "#dc2626",
                      }}
                    />
                  </div>
                  <span className={styles.scoreValue}>{app.eligibilityScore}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <ApplicationDetailModal app={selected} onClose={() => setSelected(null)} user={user} />
      )}

      {/* Approve/Reject Action Modal */}
      {actionModal && (
        <div className={styles.overlay} onClick={() => setActionModal(null)}>
          <div className={styles.actionModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.actionModalHeader}>
              <h3>
                {actionModal.action === "approve" ? (
                  <><ThumbsUp size={18} color="#16a34a" /> Approve Application</>
                ) : (
                  <><ThumbsDown size={18} color="#dc2626" /> Reject Application</>
                )}
              </h3>
              <button className={styles.closeBtn} onClick={() => setActionModal(null)}>
                <X size={16} />
              </button>
            </div>
            <div className={styles.actionModalBody}>
              <p className={styles.actionAppInfo}>
                <strong>{actionModal.app.id}</strong> — {actionModal.app.schemeName}
              </p>
              <p className={styles.actionAppInfo}>
                Applicant: {actionModal.app.applicantName} | {actionModal.app.district}, {actionModal.app.state}
              </p>
              <label className={styles.actionLabel}>
                <MessageSquare size={14} />
                {actionModal.action === "approve" ? "Approval Remarks (optional)" : "Rejection Reason (required)"}
              </label>
              <textarea
                className={styles.actionTextarea}
                placeholder={actionModal.action === "approve"
                  ? "Enter approval remarks..."
                  : "Enter reason for rejection (mandatory)..."
                }
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
              />
              <div className={styles.actionFooter}>
                <button className="btn btn-ghost btn-sm" onClick={() => setActionModal(null)}>Cancel</button>
                <button
                  className={actionModal.action === "approve" ? styles.confirmApprove : styles.confirmReject}
                  onClick={confirmAction}
                  disabled={actionModal.action === "reject" && !actionReason.trim()}
                >
                  {actionModal.action === "approve" ? (
                    <><CheckCircle2 size={14} /> Confirm Approval</>
                  ) : (
                    <><XCircle size={14} /> Confirm Rejection</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Application Detail Modal ─── */
function ApplicationDetailModal({ app, onClose, user }) {
  const statusConf = STATUS_CONFIG[app.status] || {};
  const StatusIcon = STATUS_ICONS[app.status] || Clock;
  const isOfficer = user?.role === "officer";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalHeaderTop}>
              <span className={styles.modalAppId}>{app.id}</span>
              <span className={styles.statusBadge} style={{ background: statusConf.bg, color: statusConf.color }}>
                <StatusIcon size={12} /> {statusConf.label}
              </span>
            </div>
            <h2 className={styles.modalTitle}>{app.schemeName}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Applicant</span>
              <span className={styles.infoValue}>{app.applicantName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Aadhaar</span>
              <span className={styles.infoValue}>{isOfficer ? app.aadhaar : app.aadhaar.replace(/\d{4}$/, "****")}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Location</span>
              <span className={styles.infoValue}>{app.district}, {app.state}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Amount</span>
              <span className={styles.infoValue} style={{ color: "var(--primary-600)", fontWeight: 800 }}>{app.amount}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Category</span>
              <span className={styles.infoValue}>{app.schemeCategory}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Eligibility Score</span>
              <div className={styles.scoreBarLg}>
                <div
                  className={styles.scoreFillLg}
                  style={{
                    width: `${app.eligibilityScore}%`,
                    background: app.eligibilityScore >= 80 ? "#16a34a" : app.eligibilityScore >= 50 ? "#d97706" : "#dc2626",
                  }}
                />
                <span className={styles.scoreText}>{app.eligibilityScore}/100</span>
              </div>
            </div>
          </div>

          {app.status === "rejected" && app.rejectionReason && (
            <div className={styles.rejectionCard}>
              <div className={styles.rejectionHeader}>
                <XCircle size={16} /> Rejection Details
              </div>
              <p className={styles.rejectionText}>{app.rejectionReason}</p>
              <div className={styles.rejectionOfficer}>
                <span>Rejected by: <strong>{app.rejectionOfficer}</strong></span>
                <span>{app.rejectionDesignation}</span>
              </div>
            </div>
          )}

          <h3 className={styles.timelineTitle}>
            <ClipboardCheck size={16} />
            Approval Workflow — Officer Chain
          </h3>

          <div className={styles.timeline}>
            {app.stages.map((stage, i) => {
              const ws = WORKFLOW_STAGES[i];
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "in_progress";
              const isRejected = stage.status === "rejected";
              const isPending = stage.status === "pending";

              return (
                <div key={i} className={`${styles.timelineItem} ${isActive ? styles.timelineActive : ""}`}>
                  <div className={styles.timelineLine}>
                    <div
                      className={`${styles.timelineDot} ${
                        isCompleted ? styles.dotCompleted :
                        isActive ? styles.dotActive :
                        isRejected ? styles.dotRejected :
                        styles.dotPending
                      }`}
                    >
                      {isCompleted && "✓"}
                      {isActive && "●"}
                      {isRejected && "✕"}
                      {isPending && (i + 1)}
                    </div>
                    {i < 5 && <div className={`${styles.timelineConnector} ${isCompleted ? styles.connectorDone : ""}`} />}
                  </div>

                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.stageName}>{ws.name}</span>
                      <span className={styles.stageRole}>{ws.role}</span>
                    </div>
                    {stage.officer && (
                      <div className={styles.officerInfo}>
                        <span className={styles.officerName}>{stage.officer}</span>
                        {stage.designation && <span className={styles.officerDesg}>{stage.designation}</span>}
                      </div>
                    )}
                    {stage.remarks && (
                      <p className={`${styles.stageRemarks} ${isRejected ? styles.remarksRejected : ""}`}>
                        {stage.remarks}
                      </p>
                    )}
                    {stage.date && <span className={styles.stageDate}>{stage.date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
