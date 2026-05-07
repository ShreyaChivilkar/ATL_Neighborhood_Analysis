"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const METRICS = [
  { key: "final_score",          label: "Livability Score",       color: "#4f46e5" },
  { key: "complaints_per_1000",  label: "Service Demand",         color: "#2563eb" },
  { key: "avg_severity",         label: "Issue Severity",         color: "#d97706" },
  { key: "avg_resolution_score", label: "Resolution Efficiency",  color: "#059669" },
];

const CustomTooltip = ({ active, payload, label, color, metricLabel }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a",
      border: "none",
      borderRadius: "6px",
      padding: "5px 9px",
      fontSize: "11px",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
      <div style={{ color, fontWeight: 600 }}>
        {metricLabel}: {Number(payload[0].value).toFixed(2)}
      </div>
    </div>
  );
};

export default function TrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 10px" }}>
      {METRICS.map((m) => {
        const vals = data.map((d) => d[m.key]).filter((v) => v != null);
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const pad = (max - min) * 0.2 || 0.5;

        return (
          <div key={m.key}>
            <div style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              marginBottom: "3px",
            }}>
              {m.label}
            </div>

            <ResponsiveContainer width="100%" height={75}>
              <LineChart data={data} margin={{ top: 4, right: 6, left: -30, bottom: 0 }}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[min - pad, max + pad]}
                  tickCount={3}
                />
                <Tooltip
                  content={<CustomTooltip color={m.color} metricLabel={m.label} />}
                />
                <Line
                  type="monotone"
                  dataKey={m.key}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: m.color, strokeWidth: 0 }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
