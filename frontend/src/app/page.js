"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ChevronDown, X, Accessibility } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import ApplicationsPage from "@/components/ApplicationsPage";
import DisbursementPage from "@/components/DisbursementPage";
import LoginPage from "@/components/LoginPage";
import { QuickLinksSection, FraudAlertsSection, FAQSection, CategoryFlipCards } from "@/components/DashboardSections";
import GovFooter from "@/components/GovFooter";
import {
  fetchSubsidies,
  fetchStats,
  syncSchemes,
  STATE_LIST,
  CATEGORY_LIST,
  MINISTRY_LIST,
} from "@/lib/api";
import styles from "./page.module.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [schemes, setSchemes] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");
  const [category, setCategory] = useState("All Categories");
  const [ministry, setMinistry] = useState("All Ministries");
  const [limit, setLimit] = useState(20);

  const searchTimeout = useRef(null);

  // ─── Data Loading ───
  const loadSchemes = useCallback(async (overrideLimit) => {
    try {
      setSchemesLoading(true);
      setError(null);
      const data = await fetchSubsidies({ search, state, category, ministry, limit: overrideLimit || limit });
      setSchemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSchemesLoading(false);
    }
  }, [search, state, category, ministry, limit]);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await fetchStats();
      setStats(data);
    } catch { /* non-critical */ } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchemes();
    loadStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setLimit(20);
      loadSchemes(20);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search, state, category, ministry]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = async () => {
    const newLimit = limit + 20;
    setLoadingMore(true);
    try {
      const data = await fetchSubsidies({ search, state, category, ministry, limit: newLimit });
      setSchemes(data);
      setLimit(newLimit);
    } catch { /* silent */ } finally {
      setLoadingMore(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncSchemes();
      await loadSchemes();
      await loadStats();
    } catch { /* silent */ } finally {
      setIsSyncing(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setState("All States");
    setCategory("All Categories");
    setMinistry("All Ministries");
    setLimit(20);
  };

  const hasActiveFilters =
    search || state !== "All States" || category !== "All Categories" || ministry !== "All Ministries";

  // ─── Tab Content ───
  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <>
            <Header title="Analytics" subtitle="Data-driven insights across government schemes" />
            <div className="page-content">
              <StatsCards stats={stats} loading={statsLoading} />
              <div style={{ marginTop: 24 }}>
                <AnalyticsCharts stats={stats} />
              </div>
            </div>
            <GovFooter />
          </>
        );

      case "applications":
        return (
          <>
            <Header title="Applications" subtitle="Multi-stage approval workflow & verification engine" />
            <div className="page-content">
              <ApplicationsPage user={user} />
            </div>
            <GovFooter />
          </>
        );

      case "disbursement":
        return (
          <>
            <Header title="Disbursement" subtitle="Staged fund release & compliance milestone tracking" />
            <div className="page-content">
              <DisbursementPage user={user} />
            </div>
            <GovFooter />
          </>
        );

      case "schemes":
        return (
          <>
            <Header
              title="All Schemes"
              subtitle={stats ? `${stats.totalSchemes?.toLocaleString()} government schemes available` : "Loading..."}
              onSync={handleSync}
              isSyncing={isSyncing}
            />
            <div className="page-content">
              {renderFiltersAndSchemes()}
            </div>
            <GovFooter />
          </>
        );

      default: // dashboard
        return (
          <>
            <Header
              title="Dashboard"
              subtitle="Government Subsidy & Grant Tracking System"
              onSync={handleSync}
              isSyncing={isSyncing}
            />
            <div className="page-content">
              {/* Welcome Banner — UX4G Style */}
              <div className={styles.welcomeBanner}>
                <div className={styles.welcomeDecor}>
                  <div className={styles.decorCircle1} />
                  <div className={styles.decorCircle2} />
                </div>
                <div className={styles.welcomeContent}>
                  <div className={styles.welcomeBadge}>
                    Government of India Initiative
                  </div>
                  <h2 className={styles.welcomeTitle}>
                    Government Subsidy &<br /> Grant Tracking System
                  </h2>
                  <p className={styles.welcomeText}>
                    Discover and track {stats?.totalSchemes?.toLocaleString() || "4,600+"} government schemes, subsidies, and grants across all states and ministries.
                  </p>
                  <div className={styles.welcomeActions}>
                    <button className="btn btn-primary" onClick={() => setActiveTab("schemes")}>
                      <Search size={16} />
                      Explore Schemes
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveTab("analytics")}>
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>

              <StatsCards stats={stats} loading={statsLoading} />

              {/* UMANG-style Category Flip Cards */}
              <CategoryFlipCards />

              <div className={styles.sectionHeader} style={{ marginTop: 28 }}>
                <h2 className={styles.sectionTitle}>Recent Schemes</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("schemes")}>
                  View All →
                </button>
              </div>

              {renderSchemesList(true)}

              <QuickLinksSection />
              <FraudAlertsSection />
              <FAQSection />
            </div>
            <GovFooter />
          </>
        );
    }
  };

  const renderFiltersAndSchemes = () => (
    <>
      <div className={styles.filters}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              className={`input ${styles.searchInput}`}
              type="text"
              placeholder="Search for schemes, ministries, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-schemes"
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterRow}>
          <select className="select" value={state} onChange={(e) => setState(e.target.value)} id="filter-state">
            {STATE_LIST.map((s) => (
              <option key={s} value={s}>{s === "All" ? "Central Schemes" : s}</option>
            ))}
          </select>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} id="filter-category">
            {CATEGORY_LIST.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="select" value={ministry} onChange={(e) => setMinistry(e.target.value)} id="filter-ministry">
            {MINISTRY_LIST.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>
      {renderSchemesList(false)}
    </>
  );

  const renderSchemesList = (preview = false) => {
    const displaySchemes = preview ? schemes.slice(0, 8) : schemes;

    if (error) {
      return (
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>!</div>
          <h3>Backend Unavailable</h3>
          <p>Make sure the Spring Boot backend is running on port 8080.</p>
          <code className={styles.errorCode}>{error}</code>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => loadSchemes()}>Retry</button>
        </div>
      );
    }

    if (schemesLoading && schemes.length === 0) {
      return (
        <div className={styles.schemesList}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`card ${styles.skeletonCard}`}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: "65%", height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "45%", height: 11, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: "25%", height: 18 }} />
              </div>
              <div>
                <div className="skeleton" style={{ width: 70, height: 18, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: 50, height: 11 }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (displaySchemes.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><Search size={36} /></div>
          <h3>No schemes found</h3>
          <p>Try different filters or search terms.</p>
          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>Reset Filters</button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className={styles.schemesList}>
          {displaySchemes.map((scheme, i) => (
            <SchemeCard key={scheme.id} scheme={scheme} index={i} onClick={() => setSelectedScheme(scheme)} />
          ))}
        </div>
        {!preview && schemes.length >= limit && (
          <div className={styles.loadMoreWrap}>
            {loadingMore ? <div className="spinner" /> : (
              <button className="btn btn-outline" onClick={handleLoadMore}>
                Load More Schemes
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        )}
      </>
    );
  };

  // Login gate
  if (!user || activeTab === "login") {
    return <LoginPage onLogin={(u) => { setUser(u); setActiveTab("dashboard"); }} />;
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <main className="main-content">
        {renderContent()}
      </main>

      {selectedScheme && (
        <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
      )}

      {/* UX4G Accessibility Widget */}
      <button className={styles.a11yWidget} aria-label="Accessibility options" title="Accessibility">
        <Accessibility size={22} />
      </button>
    </div>
  );
}
