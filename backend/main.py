from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = "data"

# ----------------------------
# LOAD DATA (once at startup)
# ----------------------------
file_path = os.path.join(DATA_PATH, "bg_with_neighborhood.csv")
bg_df = pd.read_csv(file_path, dtype={"GEOID": str})

# ✅ BUILD CACHE (GEOID → name)
geoid_to_name = {
    row["GEOID"]: (
        row["neighborhood_name"]
        if pd.notna(row["neighborhood_name"])
        else f"GEOID {row['GEOID']}"
    )
    for _, row in bg_df.iterrows()
}

# ----------------------------
# BASIC ROUTES
# ----------------------------
@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/test-data")
def test_data():
    file_path = os.path.join(DATA_PATH, "map_2023.geojson")

    with open(file_path) as f:
        data = json.load(f)

    return {"total_features": len(data["features"])}

# ----------------------------
# REGION DETAILS
# ----------------------------
@app.get("/region")
def get_region(geoid: str, year: int):

    #  Get name from CSV
    row = bg_df[bg_df["GEOID"] == geoid]

    if not row.empty and pd.notna(row.iloc[0]["neighborhood_name"]):
        display_name = row.iloc[0]["neighborhood_name"]
    else:
        display_name = f"BG {geoid[-6:]}"

    file_path = os.path.join(DATA_PATH, f"map_{year}.geojson")

    with open(file_path) as f:
        data = json.load(f)

    for feature in data["features"]:
        props = feature["properties"]

        if props["GEOID"] == geoid:
            issues = props.get("issue_type_counts", {})
            domains = props.get("domain_counts", {})

            top_issues = sorted(
                [{"issue": k, "count": v} for k, v in issues.items()],
                key=lambda x: x["count"],
                reverse=True
            )[:5]

            top_domains = sorted(
                [{"domain": k, "count": v} for k, v in domains.items()],
                key=lambda x: x["count"],
                reverse=True
            )[:3]

            props["top_issues"] = top_issues
            props["top_domains"] = top_domains
            props["display_name"] = display_name

            return props

    return {"error": "Region not found"}

# ----------------------------
# HIGHLIGHTS (UPDATED)
# ----------------------------
@app.get("/highlights")
def get_highlights(year: int):
    file_path = os.path.join(DATA_PATH, f"map_{year}.geojson")

    with open(file_path) as f:
        data = json.load(f)

    regions = []

    for feature in data["features"]:
        props = feature["properties"]
        geoid = str(props["GEOID"])

        regions.append({
            "GEOID": geoid,
            "name": geoid_to_name.get(geoid, f"GEOID {geoid}"),
            "final_score": props.get("final_score", 0)
        })

    sorted_regions = sorted(regions, key=lambda x: x["final_score"])

    return {
        "best": sorted_regions[:10],
        "worst": list(reversed(sorted_regions[-10:]))
    }

# ----------------------------
# OPTIONAL (can keep for debug)
# ----------------------------
@app.get("/geo-names")
def get_geo_names(geoids: list[str] = Query(...)):
    df = bg_df[bg_df["GEOID"].isin(geoids)].copy()

    df["display_name"] = df.apply(
        lambda row: row["neighborhood_name"]
        if pd.notna(row["neighborhood_name"])
        else f"GEOID {row['GEOID']}",
        axis=1
    )

    result = df[["GEOID", "display_name"]].to_dict(orient="records")

    return {"results": result}