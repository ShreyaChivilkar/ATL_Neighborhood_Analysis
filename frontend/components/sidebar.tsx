import { useEffect, useState } from "react";


type SidebarProps = {
    selectedRegion: any;
    topBest: any[];
    topWorst: any[];
    year: number;   // ✅ ADD THIS

};


export default function Sidebar({ selectedRegion, topBest, topWorst, year }: SidebarProps) {
    const [showRegions, setShowRegions] = useState(false);

    return (
        <div
            style={{
                flex: 1,
                padding: "20px",
                borderRadius: "12px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                overflow: "auto",
                color: "#111827"   // 🔥 FIX: strong text color
            }}
        >
            {/* Selected Region */}
            <h3 style={{ marginBottom: "10px", color: "#111827" }}>
                Selected Region
            </h3>

            {selectedRegion ? (
                <div style={{ lineHeight: "1.8", color: "#374151" }}>
                    <p><strong>Final Score:</strong> {selectedRegion.final_score?.toFixed(2)}</p>
                    <p><strong>Complaints:</strong> {selectedRegion.complaints_per_1000?.toFixed(2)}</p>
                    <p><strong>Severity:</strong> {selectedRegion.avg_severity?.toFixed(2)}</p>
                    <p><strong>Resolution:</strong> {selectedRegion.avg_resolution_score?.toFixed(2)}</p>
                </div>
            ) : (
                <p style={{ color: "#6b7280" }}>Click a region on the map</p>
            )}

            {selectedRegion && (
                <>
                    <hr style={{ margin: "20px 0" }} />

                    <div style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start"
                    }}>

                        {/* DOMAINS */}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: "10px", fontWeight: "600" }}>
                                🔥 Domains
                            </h4>

                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {selectedRegion.top_domains?.map((item: any, i: number) => (
                                    <li key={i} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #e5e7eb"
                                    }}>
                                        <span>{item.domain}</span>
                                        <span style={{ color: "#2563eb", fontWeight: "600" }}>
                                            {item.count}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ISSUES */}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: "10px", fontWeight: "600" }}>
                                ⚠️ Issues
                            </h4>

                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {selectedRegion.top_issues?.map((item: any, i: number) => (
                                    <li key={i} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #e5e7eb"
                                    }}>
                                        <span>{item.issue}</span>
                                        <span style={{ color: "#dc2626", fontWeight: "600" }}>
                                            {item.count}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </>
            )}

            <hr style={{ margin: "20px 0" }} />

            <div style={{
                display: "flex",
                gap: "24px",
                marginTop: "20px"
            }}>

                {/* COLLAPSIBLE REGIONS */}
                <div style={{
                    marginTop: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    background: "rgba(212, 106, 40, 0.05)",

                    overflow: "hidden"
                }}>

                    {/* HEADER */}
                    <div
                        onClick={() => setShowRegions(!showRegions)}
                        style={{
                            padding: "14px 16px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "600",
                            color: "#1f2937"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>

                            {/* LEFT: Title */}
                            <span style={{
                                fontWeight: "600",
                                fontSize: "16px",
                                color: "#111827"
                            }}>
                                Region Rankings
                            </span>

                            {/* RIGHT: Meta info */}
                            <span style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                background: "#f1f5f9",
                                fontStyle: "italic",      // ✅ italic
                                marginLeft: "6px",      // ✅ spacing away

                                padding: "4px 10px",
                                borderRadius: "999px"
                            }}>
                                Top 10 for Year {year}
                            </span>

                        </div>
                    </div>

                    {/* CONTENT */}
                    {showRegions && (
                        <div style={{
                            padding: "18px",
                            borderTop: "1px solid #e5e7eb"
                        }}>

                            <div style={{
                                display: "flex",
                                gap: "40px",
                                width: "100%"
                            }}>

                                {/* BEST */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "17px",
                                        fontWeight: "600",
                                        color: "#2563eb",
                                        marginBottom: "10px"
                                    }}>
                                        Best Regions
                                    </div>

                                    {/* HEADER */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 70px",
                                        fontSize: "15px",
                                        color: "#6b7280",
                                        marginBottom: "10px",
                                        borderBottom: "1px solid #e5e7eb",   // ✅ HERE
                                        paddingBottom: "4px"
                                    }}>
                                        <span style={{
                                            fontWeight: "700",
                                            fontSize: "13.5px",
                                            color: "#111827"
                                        }}>
                                            Region
                                        </span>

                                        <span style={{
                                            textAlign: "right",
                                            fontWeight: "700",
                                            fontSize: "13.5px",
                                            color: "#111827"
                                        }}>
                                            Score
                                        </span>
                                    </div>

                                    {topBest.map((r, i) => (
                                        <div
                                            key={i}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 70px",
                                                padding: "10px 8px",   // 👈 add horizontal padding (important!)
                                                borderBottom: "1px solid #f1f5f9",
                                                borderRadius: "6px",
                                                transition: "background 0.2s ease"
                                            }}

                                        >
                                            <span style={{
                                                color: "#1f2937",
                                                fontWeight: "600",
                                                fontSize: "14.5px"
                                            }}>
                                                {r.name && !r.name.startsWith("GEOID")
                                                    ? r.name
                                                    : `BG ${r.GEOID.slice(-6)}`}
                                            </span>

                                            <span style={{
                                                textAlign: "right",
                                                fontWeight: "700",
                                                fontSize: "15px",
                                                color: "#16a34a"   // ✅ green
                                            }}>
                                                {r.final_score.toFixed(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* WORST */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "17px",
                                        fontWeight: "600",
                                        color: "#2563eb",   // ✅ same color
                                        marginBottom: "10px"
                                    }}>
                                        Worst Regions
                                    </div>

                                    {/* HEADER */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 70px",
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        marginBottom: "10px",
                                        borderBottom: "1px solid #e5e7eb",
                                        paddingBottom: "4px"
                                    }}>
                                        <span style={{
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            color: "#111827"
                                        }}>
                                            Region
                                        </span>

                                        <span style={{
                                            textAlign: "right",
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            color: "#111827"
                                        }}>
                                            Score
                                        </span>
                                    </div>



                                    {topWorst.map((r, i) => (
                                        <div
                                            key={i}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 70px",
                                                padding: "10px 8px",   // 👈 add horizontal padding (important!)
                                                borderBottom: "1px solid #f1f5f9",
                                                borderRadius: "6px",
                                                transition: "background 0.2s ease"
                                            }}

                                        >
                                            <span style={{
                                                color: "#1f2937",
                                                fontWeight: "600",
                                                fontSize: "14.5px"
                                            }}>
                                                {r.name && !r.name.startsWith("GEOID")
                                                    ? r.name
                                                    : `BG ${r.GEOID.slice(-6)}`}
                                            </span>

                                            <span style={{
                                                textAlign: "right",
                                                fontWeight: "700",
                                                fontSize: "15px",
                                                color: "#dc2626"   // ✅ red
                                            }}>
                                                {r.final_score.toFixed(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}