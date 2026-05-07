// components/methodology.tsx
"use client";

import { useState } from "react";

export default function Methodology() {
    const [openSection, setOpenSection] = useState<string | null>("pipeline");

    const toggle = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const sectionStyle = {
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#f8fafc",
        padding: "16px",
        marginBottom: "16px"
    };

    const titleStyle = {
        fontSize: "15px",
        fontWeight: "600",
        color: "#111827",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between"
    };

    const contentStyle = {
        marginTop: "12px",
        fontSize: "13px",
        color: "#374151",
        lineHeight: "1.6"
    };

    return (
        <div style={{ padding: "20px 30px", color: "#111827" }}>

            {/* HEADER */}
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                Methodology
            </h2>

            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
                How raw 311 service requests are transformed into neighborhood-level livability insights.
            </p>

            {/* OVERVIEW */}
            <div style={{
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                color: "#e2e8f0",
                padding: "20px",
                borderRadius: "14px",
                marginBottom: "20px",
                border: "1px solid #334155"
            }}>
                <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
                    How this works
                </h3>

                <p style={{ fontSize: "13px", color: "#cbd5f5" }}>
                    We transform raw 311 service requests into neighborhood-level livability scores
                    by combining demand, issue severity, and service efficiency.
                </p>

                <div style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "#94a3b8"
                }}>
                    <span>📍 400K+ requests</span>
                    <span>🗺 Block group level</span>
                    <span>📊 5-year aggregation</span>
                    <span>⚖️ Composite scoring</span>
                </div>
            </div>

            {/* PIPELINE */}
            <div style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
                flexWrap: "wrap"
            }}>
                {[
                    "Geocoding",
                    "Spatial Join",
                    "Aggregation",
                    "Scoring"
                ].map((step, i) => (
                    <div key={i} style={{
                        background: "#f1f5f9",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        border: "1px solid #e2e8f0"
                    }}>
                        {step}
                    </div>
                ))}
            </div>

            {/* SCORING */}
            <div style={sectionStyle}>
                <div style={titleStyle} onClick={() => toggle("scoring")}>
                    <span>Scoring Model</span>
                    <span>{openSection === "scoring" ? "▲" : "▼"}</span>
                </div>

                {openSection === "scoring" && (
                    <div style={contentStyle}>

                        <p><strong>Livability Score:</strong></p>

                        <div style={{
                            background: "#111827",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            marginBottom: "12px"
                        }}>
                            0.4 × Demand + 0.3 × Severity + 0.3 × Resolution
                        </div>

                        <p><strong>Demand:</strong> Complaints per 1000 residents</p>

                        <p><strong>Severity:</strong> Domain weight × Issue weight</p>

                        <p><strong>Resolution:</strong> Based on how actual resolution time compares to expected baseline using quantiles</p>

                    </div>
                )}
            </div>

            {/* CENSUS */}
            <div style={sectionStyle}>
                <div style={titleStyle} onClick={() => toggle("census")}>
                    <span>Census Integration</span>
                    <span>{openSection === "census" ? "▲" : "▼"}</span>
                </div>

                {openSection === "census" && (
                    <div style={contentStyle}>
                        <p>
                            Demographic features from ACS Census data are integrated at the block-group level,
                            including income, renter percentage, and racial composition, enabling contextual analysis.
                        </p>
                    </div>
                )}
            </div>

            {/* LIMITATIONS */}
            <div style={sectionStyle}>
                <div style={titleStyle} onClick={() => toggle("limitations")}>
                    <span>Limitations</span>
                    <span>{openSection === "limitations" ? "▲" : "▼"}</span>
                </div>

                {openSection === "limitations" && (
                    <div style={contentStyle}>
                        <ul>
                            <li>311 data reflects reported issues, not all issues</li>
                            <li>Geocoding errors may exist</li>
                            <li>Aggregation may smooth local variations</li>
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}