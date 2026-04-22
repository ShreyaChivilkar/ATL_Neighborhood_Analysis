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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div style={{ padding: "20px" }}>
        <h1>311 Neighborhood Dashboard</h1>
        <div style={{ marginTop: "10px" }}>
          <span style={{ marginRight: "10px", fontWeight: "500" }}>
            Select Year:
          </span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: "#ffffff",  // ✅ force white
              color: "#000000"             // ✅ force black text
            }}
          >
            <option value={2021} style={{ color: "black", backgroundColor: "white" }}>2021</option>
            <option value={2022} style={{ color: "black", backgroundColor: "white" }}>2022</option>
            <option value={2023} style={{ color: "black", backgroundColor: "white" }}>2023</option>
            <option value={2024} style={{ color: "black", backgroundColor: "white" }}>2024</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "20px",
          padding: "0 20px 20px 20px",
          overflow: "hidden",
        }}
      >
        {/* 
         */}
        <div style={{ flex: 2 }}>
          <Map
            geoData={geoData}
            year={year}
            setSelectedRegion={setSelectedRegion}
          />
        </div>

        {/* SIDEBAR */}
        <Sidebar
          selectedRegion={selectedRegion}
          topBest={topBest}
          topWorst={topWorst}
        />
      </div>
    </div>
  );
}