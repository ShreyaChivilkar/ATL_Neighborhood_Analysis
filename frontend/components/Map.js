"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export default function Map({ geoData, year, setSelectedRegion }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const yearRef = useRef(year);

  useEffect(() => {
    yearRef.current = year;
  }, [year]);

  useEffect(() => {
    if (!geoData) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (mapRef.current) {
      const map = mapRef.current;
      const source = map.getSource("blocks");
      if (source) {
        source.setData(geoData);
      }
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-84.3880, 33.7490],
      zoom: 10,
      minZoom: 9,
      maxZoom: 14,
      scrollZoom: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("blocks", {
        type: "geojson",
        data: geoData,
      });

      map.addLayer({
        id: "blocks-fill",
        type: "fill",
        source: "blocks",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "final_score"],
            0, "#2ECC71",     // good (green)
            20, "#A3E635",    // light green
            40, "#FACC15",    // yellow
            60, "#FB923C",    // orange
            80, "#EF4444"     // bad (red)

          ],
          "fill-opacity": 0.6,
        },
      });

      map.addLayer({
        id: "blocks-outline",
        type: "line",
        source: "blocks",
        paint: {
          "line-color": "#333",
          "line-width": 0.5,
        },
      });

      // map.on("click", "blocks-fill", (e) => {
      //   const geoid = e.features[0].properties.GEOID;

      //   fetch(`http://127.0.0.1:8000/region?geoid=${geoid}&year=${yearRef.current}`)
      //     .then(res => res.json())
      //     .then(data => {
      //       console.log("Backend data:", data);
      //       setSelectedRegion(data);
      //     });
      // });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["blocks-fill"]
        });

        if (!features.length) return;

        const geoid = features[0].properties.GEOID;

        console.log("Clicked GEOID:", geoid); // 🔥 debug

        fetch(`http://127.0.0.1:8000/region?geoid=${geoid}&year=${yearRef.current}`)
          .then(res => {
            console.log("Status:", res.status);
            if (!res.ok) {
              throw new Error("Response not OK");
            }
            return res.json();
          })
          .then(data => {
            console.log("Backend data:", data);
            setSelectedRegion(data);
          })
          .catch(err => {
            console.error("FETCH ERROR:", err);
          });
      });
    });

  }, [geoData]);

  return <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />;
}