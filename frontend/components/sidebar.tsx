import { useState } from "react";
import TrendChart from "./TrendChart";

type SidebarProps = {
    selectedRegion: any;
    topBest: any[];
    topWorst: any[];
    year: number;
    trendData: any[];
};


export default function Sidebar({ selectedRegion, topBest, topWorst, year, trendData }: SidebarProps) {
    const [showRegions, setShowRegions] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(true);
    const [showTrends, setShowTrends] = useState(false);

    const cardStyle = {
        padding: "10px",
        borderRadius: "10px",
        background: "#ffffff",
        border: "1px solid #e5e7eb"
    };

    const labelStyle = {
        fontSize: "12px",
        fontWeight: "600",
        color: "#475569",
        letterSpacing: "0.2px"
    };

    const valueStyle = {
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827"
    };

    const LabelWithInfo = ({
        label,
        tooltip
    }: {
        label: React.ReactNode;
        tooltip: string;
    }) => {
        const [show, setShow] = useState(false);

        return (
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={labelStyle}>{label}</span>

                <span
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                    style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        color: "#475569",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                >
                    i
                </span>

                {show && (
                    <div style={{
                        position: "absolute",
                        top: "24px",
                        left: "0",
                        background: "#111827",
                        color: "#ffffff",
                        fontSize: "11px",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        width: "180px",
                        lineHeight: "1.4",
                        zIndex: 10,
                        wordWrap: "break-word",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                    }}>
                        {tooltip}
                    </div>
                )}
            </div>
        );
    };


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
            <div style={{
                marginBottom: "20px",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                background: "#f8fafc",
                padding: "16px"
            }}>

                {!selectedRegion ? (
                    // 🔹 EMPTY STATE
                    <div style={{
                        textAlign: "center",
                        padding: "20px 12px",
                        borderRadius: "10px",
                        background: "#f9fafb",
                        border: "1px dashed #e5e7eb"
                    }}>
                        <p style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            marginBottom: "4px"
                        }}>
                            No region selected
                        </p>

                        <p style={{
                            fontSize: "12px",
                            color: "#9ca3af"
                        }}>
                            Click a region on the map to explore details
                        </p>
                    </div>

                ) : (
                    // 🔹 SELECTED STATE
                    <>
                        {/* HEADER */}
                        <div style={{ marginBottom: "12px" }}>
                            <p style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px"
                            }}>
                                Selected Region
                            </p>

                            <h2 style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#111827"
                            }}>
                                {selectedRegion.display_name}
                            </h2>
                        </div>

                        {/* METRICS */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px"
                        }}>

                            {/* Score */}
                            <div style={cardStyle}>
                                <LabelWithInfo
                                    label={
                                        <span style={{ color: "#4f46e5" }}>
                                            Livability Score ⭐
                                        </span>
                                    }
                                    tooltip="Composite score based on service demand, issue severity, and resolution efficiency"
                                />
                                <p style={valueStyle}>
                                    {selectedRegion.final_score?.toFixed(1)}
                                </p>
                            </div>

                            {/* Complaints */}
                            <div style={cardStyle}>
                                <LabelWithInfo
                                    label={
                                        <span style={{ color: "#2563eb" }}>
                                            Service Demand
                                        </span>
                                    }
                                    tooltip="Number of complaints per 1,000 residents in this area"
                                />
                                <p style={valueStyle}>
                                    {selectedRegion.complaints_per_1000?.toFixed(1)}
                                </p>
                            </div>

                            {/* Severity */}
                            <div style={cardStyle}>
                                <LabelWithInfo
                                    label={
                                        <span style={{ color: "#d97706" }}>
                                            Issue Severity
                                        </span>
                                    }
                                    tooltip="Weighted score based on issue type and domain impact"
                                />
                                <p style={valueStyle}>
                                    {selectedRegion.avg_severity?.toFixed(1)}
                                </p>
                            </div>

                            {/* Resolution */}
                            <div style={cardStyle}>
                                <LabelWithInfo
                                    label={
                                        <span style={{ color: "#059669" }}>
                                            Resolution Efficiency
                                        </span>
                                    }
                                    tooltip="How quickly issues are resolved compared to expected resolution times"
                                />
                                <p style={valueStyle}>
                                    {selectedRegion.avg_resolution_score?.toFixed(2)}
                                </p>
                            </div>

                        </div>
                    </>
                )}
            </div>

            {selectedRegion && (
                <>
                    <hr style={{ margin: "20px 0" }} />

                    <div style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start"
                    }}>


                        <div style={{
                            marginTop: "20px",
                            borderRadius: "14px",
                            border: "1px solid #e5e7eb",
                            background: "#f8fafc",
                            overflow: "hidden"
                        }}>

                            {/* HEADER */}
                            <div
                                onClick={() => setShowBreakdown(!showBreakdown)}
                                style={{
                                    padding: "14px 16px",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <span style={{
                                        fontWeight: "600",
                                        fontSize: "15px",
                                        color: "#111827"
                                    }}>
                                        Service Breakdown
                                    </span>

                                    <span style={{
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        fontStyle: "italic"
                                    }}>
                                        Top Issues & Domains
                                    </span>
                                </div>

                                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                                    {showBreakdown ? "▲" : "▼"}
                                </span>
                            </div>

                            {/* CONTENT */}
                            {showBreakdown && (
                                <div style={{
                                    padding: "16px",
                                    borderTop: "1px solid #e5e7eb"
                                }}>

                                    {!selectedRegion && (
                                        <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                                            Click a region to see breakdown
                                        </p>
                                    )}

                                    {selectedRegion && (
                                        <div style={{ display: "flex", gap: "32px" }}>

                                            {/* DOMAINS */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    color: "#475569",
                                                    marginBottom: "8px"
                                                }}>
                                                    Domains
                                                </div>

                                                {/* HEADER */}
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 50px",
                                                    marginBottom: "8px",
                                                    paddingBottom: "4px",
                                                    borderBottom: "1px solid #e5e7eb"
                                                }}>
                                                    <span style={{
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#94a3b8"
                                                    }}>
                                                        Domain
                                                    </span>

                                                    <span style={{
                                                        textAlign: "right",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#94a3b8"
                                                    }}>
                                                        Requests
                                                    </span>
                                                </div>

                                                {selectedRegion.top_domains?.map((d: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr 50px",
                                                            alignItems: "center",
                                                            padding: "10px 8px",
                                                            borderBottom: "1px solid #f1f5f9",
                                                            borderRadius: "6px",
                                                            transition: "background 0.2s ease"
                                                        }}
                                                    >
                                                        <span style={{
                                                            fontWeight: "500",
                                                            fontSize: "13.5px",
                                                            color: "#1f2937"
                                                        }}>
                                                            {d.domain}
                                                        </span>

                                                        <span style={{
                                                            textAlign: "right",
                                                            fontWeight: "700",
                                                            fontSize: "13.5px",
                                                            color: "#2563eb"
                                                        }}>
                                                            {d.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* ISSUES */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    color: "#475569",
                                                    marginBottom: "8px"
                                                }}>
                                                    Issues
                                                </div>

                                                {/* HEADER */}
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 50px",
                                                    marginBottom: "8px",
                                                    paddingBottom: "4px",
                                                    borderBottom: "1px solid #e5e7eb"
                                                }}>
                                                    <span style={{
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#94a3b8"
                                                    }}>
                                                        Issue
                                                    </span>

                                                    <span style={{
                                                        textAlign: "right",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "#94a3b8"
                                                    }}>
                                                        Requests
                                                    </span>
                                                </div>

                                                {selectedRegion.top_issues?.map((d: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr 50px",
                                                            alignItems: "center",
                                                            padding: "10px 8px",
                                                            borderBottom: "1px solid #f1f5f9",
                                                            borderRadius: "6px",
                                                            transition: "background 0.2s ease"
                                                        }}
                                                    >
                                                        <span style={{
                                                            fontWeight: "500",
                                                            fontSize: "13.5px",
                                                            color: "#1f2937"
                                                        }}>
                                                            {d.issue}
                                                        </span>

                                                        <span style={{
                                                            textAlign: "right",
                                                            fontWeight: "700",
                                                            fontSize: "13.5px",
                                                            color: "#2563eb"
                                                        }}>
                                                            {d.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}

            {selectedRegion && trendData.length > 0 && (
                <>
                    <hr style={{ margin: "20px 0" }} />
                    <div style={{
                        borderRadius: "14px",
                        border: "1px solid #e5e7eb",
                        background: "#f8fafc",
                        overflow: "hidden"
                    }}>
                        <div
                            onClick={() => setShowTrends(!showTrends)}
                            style={{
                                padding: "14px 16px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <span style={{ fontWeight: "600", fontSize: "15px", color: "#111827" }}>
                                    Year-over-Year Trends
                                </span>
                                <span style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic" }}>
                                    2021 – 2025
                                </span>
                            </div>
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>
                                {showTrends ? "▲" : "▼"}
                            </span>
                        </div>

                        {showTrends && (
                            <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                                <TrendChart data={trendData} />
                            </div>
                        )}
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