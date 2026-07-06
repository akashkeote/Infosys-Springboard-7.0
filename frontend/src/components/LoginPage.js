"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  Lock,
  CreditCard,
  Fingerprint,
} from "lucide-react";
import styles from "./LoginPage.module.css";

const ROLES = [
  {
    id: "citizen",
    label: "Citizen",
    desc: "Beneficiary / Applicant Portal",
    Icon: User,
    color: "#7c3aed",
    loginFields: ["aadhaar", "phone"],
  },
  {
    id: "vle",
    label: "VLE",
    desc: "Village Level Entrepreneur (CSC)",
    Icon: Building2,
    color: "#0891b2",
    loginFields: ["vleId", "password"],
  },
  {
    id: "officer",
    label: "Officer",
    desc: "Government Officer Portal",
    Icon: Shield,
    color: "#ea580c",
    loginFields: ["employeeId", "password"],
  },
];

// Demo credentials — role = role ID for RBAC, roleLabel = display name
const DEMO_USERS = {
  citizen: { name: "Akash Keote", role: "citizen", roleLabel: "Citizen", state: "Maharashtra", aadhaar: "XXXX-XXXX-4521" },
  vle: { name: "Ramesh Gupta", role: "vle", roleLabel: "VLE Operator", cscId: "CSC-MH-1234", state: "Maharashtra" },
  officer: { name: "Dr. Pankaj Saxena, IAS", role: "officer", roleLabel: "District Collector", state: "Madhya Pradesh", designation: "Collector, Indore" },
};

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      const user = DEMO_USERS[selectedRole];
      onLogin({ ...user, roleId: selectedRole });
      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.container}>
      {/* Government header */}
      <div className={styles.govHeader}>
        <div className={styles.flagStripe}>
          <div className={styles.saffron} />
          <div className={styles.white} />
          <div className={styles.green} />
        </div>
        <div className={styles.govHeaderContent}>
          <div className={styles.govFlag}>
            <div className={styles.flagMini}>
              <span /><span /><span />
            </div>
            <span className={styles.govTitle}>Government of India</span>
          </div>
          <div className={styles.govLinks}>
            <span>Screen Reader Access</span>
            <span>|</span>
            <span>A-</span> <span>A</span> <span>A+</span>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        {/* Left — Branding */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.brandLogo}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="21" stroke="white" strokeWidth="2" opacity="0.3" />
                <circle cx="24" cy="24" r="7" fill="white" opacity="0.9" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
                  <line key={a} x1="24" y1="24" x2={24 + 14 * Math.cos((a * Math.PI) / 180)} y2={24 + 14 * Math.sin((a * Math.PI) / 180)} stroke="white" strokeWidth="1" opacity="0.25" />
                ))}
              </svg>
            </div>
            <h1 className={styles.leftTitle}>
              Government Subsidy &<br />Grant Disbursement<br />Tracking System
            </h1>
            <p className={styles.leftDesc}>
              Track government schemes, verify beneficiary eligibility, monitor fund disbursement, and ensure transparent delivery of subsidies across India.
            </p>
            <div className={styles.leftStats}>
              <div className={styles.leftStat}>
                <span className={styles.leftStatNum}>4,680+</span>
                <span className={styles.leftStatLabel}>Schemes</span>
              </div>
              <div className={styles.leftStatDivider} />
              <div className={styles.leftStat}>
                <span className={styles.leftStatNum}>36</span>
                <span className={styles.leftStatLabel}>States & UTs</span>
              </div>
              <div className={styles.leftStatDivider} />
              <div className={styles.leftStat}>
                <span className={styles.leftStatNum}>65+</span>
                <span className={styles.leftStatLabel}>Ministries</span>
              </div>
            </div>
            <p className={styles.leftProject}>
              Infosys Springboard Virtual Internship 7.0
            </p>
          </div>
        </div>

        {/* Right — Login Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            {!selectedRole ? (
              <>
                <h2 className={styles.formTitle}>Select Your Portal</h2>
                <p className={styles.formSubtitle}>Choose your role to continue to the dashboard</p>
                <div className={styles.roleGrid}>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      className={styles.roleCard}
                      onClick={() => setSelectedRole(role.id)}
                      style={{ "--role-color": role.color }}
                    >
                      <div className={styles.roleIconWrap}>
                        <role.Icon size={24} />
                      </div>
                      <span className={styles.roleLabel}>{role.label}</span>
                      <span className={styles.roleDesc}>{role.desc}</span>
                      <ArrowRight size={16} className={styles.roleArrow} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button className={styles.backBtn} onClick={() => setSelectedRole(null)}>
                  ← Back to role selection
                </button>
                <div className={styles.roleHeader}>
                  <div className={styles.roleIconActive} style={{ background: ROLES.find(r => r.id === selectedRole)?.color }}>
                    {(() => { const R = ROLES.find(r => r.id === selectedRole); return R ? <R.Icon size={22} color="white" /> : null; })()}
                  </div>
                  <div>
                    <h2 className={styles.formTitle}>{ROLES.find(r => r.id === selectedRole)?.label} Login</h2>
                    <p className={styles.formSubtitle}>{ROLES.find(r => r.id === selectedRole)?.desc}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  {selectedRole === "citizen" && (
                    <>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <CreditCard size={14} /> Aadhaar Number
                        </label>
                        <input
                          className={styles.fieldInput}
                          type="text"
                          placeholder="XXXX XXXX XXXX"
                          maxLength={14}
                          required
                          value={formData.aadhaar || ""}
                          onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <Phone size={14} /> Registered Mobile
                        </label>
                        <input
                          className={styles.fieldInput}
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          required
                          value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <p className={styles.otpNote}>
                        <Fingerprint size={14} /> OTP will be sent to your Aadhaar-linked mobile
                      </p>
                    </>
                  )}

                  {selectedRole === "vle" && (
                    <>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <Building2 size={14} /> CSC/VLE ID
                        </label>
                        <input
                          className={styles.fieldInput}
                          type="text"
                          placeholder="CSC-XX-XXXX"
                          required
                          value={formData.vleId || ""}
                          onChange={(e) => setFormData({ ...formData, vleId: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <Lock size={14} /> Password
                        </label>
                        <div className={styles.passWrap}>
                          <input
                            className={styles.fieldInput}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            required
                            value={formData.password || ""}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                          <button type="button" className={styles.passToggle} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === "officer" && (
                    <>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <Shield size={14} /> Employee / Officer ID
                        </label>
                        <input
                          className={styles.fieldInput}
                          type="text"
                          placeholder="GOV-XXXX-XXXX"
                          required
                          value={formData.empId || ""}
                          onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <Lock size={14} /> Password
                        </label>
                        <div className={styles.passWrap}>
                          <input
                            className={styles.fieldInput}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            required
                            value={formData.password || ""}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                          <button type="button" className={styles.passToggle} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? <span className="spinner" /> : <ArrowRight size={16} />}
                    {loading ? "Signing in..." : "Sign In"}
                  </button>

                  <p className={styles.demoNote}>
                    Demo mode — enter any value to login
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
