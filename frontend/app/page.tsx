"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import jsPDF from "jspdf";

import Map from "../components/Map";
import Sidebar from "../components/sidebar";
import Methodology from "../components/methodology";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [geoData, setGeoData] = useState<any>(null);
  const [year, setYear] = useState(2021);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [topBest, setTopBest] = useState<any[]>([]);
  const [topWorst, setTopWorst] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/geojson/map_${year}.geojson`)
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, [year]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/highlights?year=${year}`)
      .then(res => res.json())
      .then(data => {
        setTopBest(data.best);
        setTopWorst(data.worst);
      });
  }, [year]);

  useEffect(() => {
    if (!selectedRegion?.GEOID) return;
    fetch(`http://127.0.0.1:8000/region/timeseries?geoid=${selectedRegion.GEOID}`)
      .then(res => res.json())
      .then(data => setTrendData(data));
  }, [selectedRegion?.GEOID]);

  const downloadPDF = async () => {
    if (!selectedRegion) {
      alert("Please select a region first");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const W = 210;
    const M = 15;           // margin
    const cW = W - M * 2;  // content width = 180

    const regionName =
      selectedRegion.display_name ||
      selectedRegion.neighborhood_name ||
      selectedRegion.GEOID;

    // ── HEADER BAR ───────────────────────────────────────────────────────────
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, W, 34, "F");

    pdf.setTextColor(248, 250, 252);
    pdf.setFontSize(17);
    pdf.setFont("helvetica", "bold");
    pdf.text("Atlanta Neighborhood Analysis", M, 13);

    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(148, 163, 184);
    pdf.text(`311-Based Livability Report  ·  Year: ${year}`, M, 21);

    // right-side label
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("City of Atlanta  ·  Block-Group Level", W - M, 13, { align: "right" });
    pdf.text("Data sourced from Atlanta 311", W - M, 20, { align: "right" });

    // thin accent line at bottom of header
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.6);
    pdf.line(0, 34, W, 34);

    // ── REGION NAME ──────────────────────────────────────────────────────────
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.text(regionName, M, 45);

    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.8);
    pdf.line(M, 48, M + 55, 48);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 116, 139);
    pdf.text("Neighborhood Report", M, 53);

    // ── METRICS CARDS (2×2) ──────────────────────────────────────────────────
    const metrics = [
      { label: "Livability Score",      value: selectedRegion.final_score?.toFixed(1),           unit: "/ 100" },
      { label: "Service Demand",        value: selectedRegion.complaints_per_1000?.toFixed(1),    unit: "per 1k" },
      { label: "Issue Severity",        value: selectedRegion.avg_severity?.toFixed(1),           unit: "" },
      { label: "Resolution Efficiency", value: selectedRegion.avg_resolution_score?.toFixed(2),   unit: "" },
    ];
    const cardW = (cW - 6) / 2;
    const cardH = 22;

    metrics.forEach((m, i) => {
      const cx = M + (i % 2) * (cardW + 6);
      const cy = 58 + Math.floor(i / 2) * (cardH + 4);

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(cx, cy, cardW, cardH, 2, 2, "FD");

      // left accent strip
      pdf.setFillColor(59, 130, 246);
      pdf.roundedRect(cx, cy, 2.5, cardH, 1, 1, "F");

      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text(m.label.toUpperCase(), cx + 6, cy + 7);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text(m.value ?? "—", cx + 6, cy + 17);

      if (m.unit) {
        const valW = pdf.getTextWidth(m.value ?? "—");
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(m.unit, cx + 6 + valW + 1.5, cy + 17);
      }
    });

    // ── SECTION DIVIDER ──────────────────────────────────────────────────────
    const svcY = 58 + 2 * (cardH + 4) + 4; // ~114

    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(M, svcY, W - M, svcY);

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Service Breakdown", M, svcY + 7);

    // ── SERVICE TABLES ────────────────────────────────────────────────────────
    const tblY = svcY + 11;
    const colW = (cW - 6) / 2;
    const rowH = 7;
    const maxItems = Math.max(
      selectedRegion.top_domains?.length ?? 0,
      selectedRegion.top_issues?.length ?? 0
    );
    const tblH = 10 + maxItems * rowH + 4;

    // helper: draw a table box
    const drawTable = (bx: number, by: number, title: string, rows: { label: string; count: number }[]) => {
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(bx, by, colW, tblH, 2, 2, "FD");

      // header row bg
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(bx, by, colW, 9, 2, 2, "F");
      pdf.rect(bx, by + 5, colW, 4, "F"); // square bottom corners of header

      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 65, 85);
      pdf.text(title, bx + 4, by + 6.5);

      // column headers
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text("COUNT", bx + colW - 4, by + 6.5, { align: "right" });

      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(bx, by + 9, bx + colW, by + 9);

      rows.forEach((r, i) => {
        const ry = by + 9 + i * rowH;
        // alternating row tint
        if (i % 2 === 1) {
          pdf.setFillColor(241, 245, 249);
          pdf.rect(bx, ry, colW, rowH, "F");
        }
        const truncated = pdf.splitTextToSize(r.label, colW - 22)[0];
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(30, 41, 59);
        pdf.text(truncated, bx + 4, ry + 5);
        pdf.setTextColor(100, 116, 139);
        pdf.text(String(r.count), bx + colW - 4, ry + 5, { align: "right" });
      });
    };

    drawTable(
      M, tblY,
      "Top Domains",
      (selectedRegion.top_domains ?? []).map((d: any) => ({ label: d.domain, count: d.count }))
    );
    drawTable(
      M + colW + 6, tblY,
      "Top Issues",
      (selectedRegion.top_issues ?? []).map((d: any) => ({ label: d.issue, count: d.count }))
    );

    // ── MAP SECTION ───────────────────────────────────────────────────────────
    const mapSecY = tblY + tblH + 8;

    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(M, mapSecY, W - M, mapSecY);

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Map View", M, mapSecY + 7);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 116, 139);
    pdf.text("Color scale: green (low) to red (high severity)", M, mapSecY + 13);

    const imgY = mapSecY + 17;
    const imgH = Math.min(90, 282 - imgY); // never push footer off the page
    if (mapInstanceRef.current) {
      const imgData = mapInstanceRef.current.getCanvas().toDataURL("image/png");
      pdf.addImage(imgData, "PNG", M, imgY, cW, imgH);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.rect(M, imgY, cW, imgH, "S");
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const footerY = imgY + imgH + 5;
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.line(M, footerY, W - M, footerY);

    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Generated: ${today}`, M, footerY + 5);
    pdf.text("Atlanta 311 Analysis Dashboard", W - M, footerY + 5, { align: "right" });

    // ── PAGE 2: DEMOGRAPHICS + YEAR-OVER-YEAR TRENDS ─────────────────────────
    pdf.addPage();

    // Mini header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, W, 22, "F");
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.6);
    pdf.line(0, 22, W, 22);

    pdf.setTextColor(248, 250, 252);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("Demographics & Trends", M, 14);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 116, 139);
    pdf.text(regionName, W - M, 14, { align: "right" });

    // ── CENSUS / DEMOGRAPHICS SECTION ────────────────────────────────────────
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(M, 26, W - M, 26);

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Census Demographics", M, 33);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 116, 139);
    pdf.text("ACS 5-Year Estimates", M + 55, 33);

    // 4 census stat cards in a row
    const censusCardW = (cW - 3 * 4) / 4;
    const censusCardH = 20;
    const censusCardY = 37;

    const censusStats = [
      {
        label: "Population",
        value: selectedRegion.population != null
          ? Math.round(selectedRegion.population).toLocaleString()
          : "N/A",
        color: [79, 70, 229] as [number, number, number],
      },
      {
        label: "Median Income",
        value: selectedRegion.median_income != null
          ? `$${Math.round(selectedRegion.median_income).toLocaleString()}`
          : "N/A",
        color: [5, 150, 105] as [number, number, number],
      },
      {
        label: "Poverty Rate",
        value: selectedRegion.poverty_rate != null
          ? `${(selectedRegion.poverty_rate * 100).toFixed(1)}%`
          : "N/A",
        color: [217, 119, 6] as [number, number, number],
      },
      {
        label: "Renters",
        value: selectedRegion.pct_renters != null
          ? `${(selectedRegion.pct_renters * 100).toFixed(1)}%`
          : "N/A",
        color: [37, 99, 235] as [number, number, number],
      },
    ];

    censusStats.forEach((stat, i) => {
      const cx2 = M + i * (censusCardW + 4);
      const cy2 = censusCardY;

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(cx2, cy2, censusCardW, censusCardH, 2, 2, "FD");

      pdf.setFillColor(...stat.color);
      pdf.roundedRect(cx2, cy2, 2.5, censusCardH, 1, 1, "F");

      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text(stat.label.toUpperCase(), cx2 + 5, cy2 + 6.5);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text(stat.value, cx2 + 5, cy2 + 15);
    });

    // Race/ethnicity breakdown bar
    const raceY = censusCardY + censusCardH + 6;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(51, 65, 85);
    pdf.text("Racial Composition", M, raceY + 5);

    const barY = raceY + 9;
    const barH = 6;
    const barW = cW;

    const pctWhite = selectedRegion.pct_white ?? 0;
    const pctBlack = selectedRegion.pct_black ?? 0;
    const pctAsian = selectedRegion.pct_asian ?? 0;
    const pctOther = Math.max(0, 1 - pctWhite - pctBlack - pctAsian);

    const raceSegments = [
      { pct: pctWhite, color: [99, 102, 241] as [number, number, number],  label: "White" },
      { pct: pctBlack, color: [16, 185, 129] as [number, number, number],  label: "Black" },
      { pct: pctAsian, color: [245, 158, 11] as [number, number, number],  label: "Asian" },
      { pct: pctOther, color: [156, 163, 175] as [number, number, number], label: "Other" },
    ];

    // Draw stacked bar
    let barX = M;
    raceSegments.forEach((seg) => {
      const segW = seg.pct * barW;
      if (segW < 0.5) return;
      pdf.setFillColor(...seg.color);
      pdf.rect(barX, barY, segW, barH, "F");
      barX += segW;
    });
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.rect(M, barY, barW, barH, "S");

    // Legend dots + labels
    let legendX = M;
    const legendY = barY + barH + 5;
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    raceSegments.forEach((seg) => {
      if (seg.pct < 0.001) return;
      pdf.setFillColor(...seg.color);
      pdf.circle(legendX + 1.5, legendY - 1.5, 1.5, "F");
      pdf.setTextColor(51, 65, 85);
      pdf.text(`${seg.label} ${(seg.pct * 100).toFixed(1)}%`, legendX + 4.5, legendY);
      legendX += 42;
    });

    // ── TREND CHARTS ──────────────────────────────────────────────────────────
    const trendsStartY = legendY + 8;

    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(M, trendsStartY, W - M, trendsStartY);

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Year-over-Year Trends", M, trendsStartY + 7);

    // Helper: hex → [r,g,b]
    const hex2rgb = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ] as [number, number, number];

    // Draw one sparkline chart inside a bounding box
    const drawSparkline = (
      metricKey: string, label: string, colorHex: string,
      bx: number, by: number, bw: number, bh: number
    ) => {
      const vals: number[] = trendData
        .map((d: any) => d[metricKey] as number)
        .filter((v) => v != null);
      if (vals.length === 0) return;

      const minV = Math.min(...vals);
      const maxV = Math.max(...vals);
      const range = maxV - minV || 1;
      const padV = range * 0.2;
      const yMin = minV - padV;
      const yMax = maxV + padV;

      const TITLE_H = 11;
      const X_LABEL_H = 9;
      const Y_LABEL_W = 16;

      const cx = bx + Y_LABEL_W;
      const cy = by + TITLE_H;
      const cw = bw - Y_LABEL_W - 3;
      const ch = bh - TITLE_H - X_LABEL_H;

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.rect(cx, cy, cw, ch, "FD");

      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const gy = cy + (ch * i) / gridLines;
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.15);
        pdf.line(cx, gy, cx + cw, gy);

        const yVal = yMax - ((yMax - yMin) * i) / gridLines;
        pdf.setFontSize(6);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(148, 163, 184);
        pdf.text(yVal.toFixed(1), cx - 1.5, gy + 1.8, { align: "right" });
      }

      const [r, g, b] = hex2rgb(colorHex);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(r, g, b);
      pdf.text(label.toUpperCase(), bx, by + 7);

      const n = trendData.length;
      const mapX = (i: number) => cx + (i / (n - 1)) * cw;
      const mapY = (v: number) => cy + ch - ((v - yMin) / (yMax - yMin)) * ch;

      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(0.9);
      for (let i = 0; i < n - 1; i++) {
        const v1 = trendData[i][metricKey];
        const v2 = trendData[i + 1][metricKey];
        if (v1 == null || v2 == null) continue;
        pdf.line(mapX(i), mapY(v1), mapX(i + 1), mapY(v2));
      }

      pdf.setFillColor(r, g, b);
      trendData.forEach((d: any, i: number) => {
        const v = d[metricKey];
        if (v == null) return;
        pdf.circle(mapX(i), mapY(v), 1.4, "F");
      });

      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(r, g, b);
      trendData.forEach((d: any, i: number) => {
        const v = d[metricKey];
        if (v == null) return;
        const dotY = mapY(v);
        const labelY = dotY > cy + ch / 2 ? dotY - 2.5 : dotY + 6;
        pdf.text(v.toFixed(1), mapX(i), labelY, { align: "center" });
      });

      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      trendData.forEach((d: any, i: number) => {
        pdf.text(String(d.year), mapX(i), cy + ch + 6.5, { align: "center" });
      });
    };

    const chartMetrics = [
      { key: "final_score",          label: "Livability Score",      color: "#4f46e5" },
      { key: "complaints_per_1000",  label: "Service Demand",        color: "#2563eb" },
      { key: "avg_severity",         label: "Issue Severity",        color: "#d97706" },
      { key: "avg_resolution_score", label: "Resolution Efficiency", color: "#059669" },
    ];

    const CHART_W = (cW - 12) / 2;
    const CHART_H = 78;
    const GRID_TOP = trendsStartY + 12;
    const ROW_GAP = 8;

    if (trendData.length > 0) {
      chartMetrics.forEach((m, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const bx = M + col * (CHART_W + 12);
        const by = GRID_TOP + row * (CHART_H + ROW_GAP);
        drawSparkline(m.key, m.label, m.color, bx, by, CHART_W, CHART_H);
      });
    } else {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(148, 163, 184);
      pdf.text("No trend data available for this region.", M, GRID_TOP + 10);
    }

    // Page 2 footer
    const p2FooterY = GRID_TOP + 2 * (CHART_H + ROW_GAP) - ROW_GAP + 8;
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.line(M, p2FooterY, W - M, p2FooterY);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Generated: ${today}`, M, p2FooterY + 5);
    pdf.text("Atlanta 311 Analysis Dashboard", W - M, p2FooterY + 5, { align: "right" });

    pdf.save(`${regionName}_report.pdf`);
  };


  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#020617"
    }}>

      {/* HEADER */}
      <div style={{
        padding: "16px 30px",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>

          {/* LEFT */}
          <div>
            <h1 style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#f8fafc"
            }}>
              Atlanta Neighborhood Analysis
            </h1>

            <p style={{
              color: "#94a3b8",
              fontSize: "12px"
            }}>
              311-based livability analysis · 5-year block-level data
            </p>
          </div>

          {/* RIGHT */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Overview", "Methodology", "About"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    background: tab === activeTab ? "#1e293b" : "transparent",
                    color: "#e2e8f0",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={downloadPDF}
              style={{
                padding: "6px 12px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0f172a";
              }}
            >
              ⬇ Download Report
            </button>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{
                padding: "5px 10px",
                borderRadius: "6px",
                background: "#020617",
                color: "#f8fafc",
                border: "1px solid #334155"
              }}
            >
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>

            </select>
          </div>



        </div>
      </div>

      {activeTab === "Methodology" && <Methodology />}


      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: "flex",
        gap: "20px",
        padding: "20px 30px",
        overflow: "hidden"
      }}>

        {/* MAP */}
        <div style={{
          flex: 2,
          height: "100%",
          minWidth: 0
        }}>


          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <Map
              geoData={geoData}
              year={year}
              setSelectedRegion={setSelectedRegion}
              mapInstanceRef={mapInstanceRef}
            />
          </div>

        </div>

        {/* SIDEBAR */}
        <div style={{
          flex: 1,
          height: "100%",
          overflow: "auto"
        }}>
          <div ref={sidebarRef}>
            <Sidebar
              selectedRegion={selectedRegion}
              topBest={topBest}
              topWorst={topWorst}
              year={year}
              trendData={trendData}
            />
          </div>
        </div>

      </div>
    </div>
  );
}