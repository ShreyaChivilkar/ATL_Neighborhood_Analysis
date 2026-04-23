"use client";

import { useEffect, useState } from "react";
import Map from "../components/Map";
import Sidebar from "../components/sidebar";

export default function Home() {
  const [geoData, setGeoData] = useState<any>(null);
  const [year, setYear] = useState(2021);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const [topBest, setTopBest] = useState<any[]>([]);
  const [topWorst, setTopWorst] = useState<any[]>([]);

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
            gap: "20px"
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Overview", "Methodology", "About"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    background: tab === "Overview" ? "#1e293b" : "transparent",
                    color: "#e2e8f0",
                    fontSize: "12px"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

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
            </select>
          </div>

        </div>
      </div>

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
          <Map
            geoData={geoData}
            year={year}
            setSelectedRegion={setSelectedRegion}
          />
        </div>

        {/* SIDEBAR */}
        <div style={{
          flex: 1,
          height: "100%",
          overflow: "auto"
        }}>
          <Sidebar
            selectedRegion={selectedRegion}
            topBest={topBest}
            topWorst={topWorst}
          />
        </div>

      </div>
    </div>
  );
}