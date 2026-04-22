type SidebarProps = {
    selectedRegion: any;
    topBest: any[];
    topWorst: any[];
};

export default function Sidebar({ selectedRegion, topBest, topWorst }: SidebarProps) {
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

                {/* LEFT — BEST */}
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        color: "#16a34a"
                    }}>
                        🌿 Best Regions
                    </h4>

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {topBest.map((r, i) => (
                            <li
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "6px 0",
                                    borderBottom: "1px solid #e5e7eb",
                                    fontSize: "14px"
                                }}
                            >
                                <span>{r.name}</span>
                                <span style={{ fontWeight: "600" }}>
                                    {r.final_score.toFixed(1)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT — WORST */}
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        color: "#dc2626"
                    }}>
                        🔥 Worst Regions
                    </h4>

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {topWorst.map((r, i) => (
                            <li
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "6px 0",
                                    borderBottom: "1px solid #e5e7eb",
                                    fontSize: "14px"
                                }}
                            >
                                <span>{r.name}</span>
                                <span style={{ fontWeight: "600" }}>
                                    {r.final_score.toFixed(1)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}