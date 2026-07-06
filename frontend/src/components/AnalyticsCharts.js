"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { PieChartIcon, BarChart3, Building2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/api";
import styles from "./AnalyticsCharts.module.css";

const PIE_COLORS = [
  "#7c3aed", "#16a34a", "#ea580c", "#0891b2", "#dc2626",
  "#6d28d9", "#ca8a04", "#e11d48", "#4338ca", "#0d9488",
  "#a78bfa", "#9333ea", "#db2777", "#059669", "#f97316", "#0284c7",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label || payload[0]?.name}</p>
      <p className={styles.tooltipValue}>{payload[0]?.value?.toLocaleString()} schemes</p>
    </div>
  );
};

export default function AnalyticsCharts({ stats }) {
  const categoryData = useMemo(() => {
    if (!stats?.byCategory) return [];
    return Object.entries(stats.byCategory)
      .map(([name, value]) => ({
        name: name.length > 25 ? name.substring(0, 22) + "..." : name,
        fullName: name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const stateData = useMemo(() => {
    if (!stats?.byState) return [];
    return Object.entries(stats.byState)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [stats]);

  const topMinistries = useMemo(() => {
    if (!stats?.byMinistry) return [];
    return Object.entries(stats.byMinistry)
      .map(([name, value]) => ({
        name: name.replace("Ministry Of ", "").replace(" And ", " & "),
        fullName: name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [stats]);

  if (!stats) {
    return (
      <div className={styles.empty}>
        <p>No analytics data available. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {/* Category Distribution — Pie Chart */}
      <div className={`card-elevated ${styles.chartCard}`}>
        <h3 className={styles.chartTitle}>
          <PieChartIcon size={16} />
          Schemes by Category
        </h3>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top States — Bar Chart */}
      <div className={`card-elevated ${styles.chartCard}`}>
        <h3 className={styles.chartTitle}>
          <BarChart3 size={16} />
          Top 15 States by Schemes
        </h3>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="var(--primary-500)"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Ministries — Horizontal Bar */}
      <div className={`card-elevated ${styles.chartCard} ${styles.fullWidth}`}>
        <h3 className={styles.chartTitle}>
          <Building2 size={16} />
          Top 10 Ministries
        </h3>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topMinistries} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                {topMinistries.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
