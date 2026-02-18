import pandas as pd
import requests
import time
from urllib.parse import quote
import os

API_KEY = ""

BASE = "https://geocode.googleapis.com/v4beta/geocode/address"

HEADERS = {
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "*"
}


def geocode_address(address):
    url = f"{BASE}/{quote(address, safe='')}"

    r = requests.get(url, headers=HEADERS, timeout=15)    
    if r.status_code != 200:
        return None, None, False

    data = r.json()

    if "results" not in data or len(data["results"]) == 0:
        return None, None, False

    try:
        result = data["results"][0]
        lat = result["location"]["latitude"]
        lng = result["location"]["longitude"]
        return lat, lng, True
    except Exception:
        return None, None, False


# Load CSV
df = pd.read_csv("../data/cleaned_data/cleaned_ATL311_2021.csv")

df_subset = df.copy()

def clean_address(addr: str) -> str:
    addr = str(addr).strip()
    # remove leading/trailing quotes (single or double)
    addr = addr.strip('"').strip("'")
    # collapse multiple spaces
    addr = " ".join(addr.split())
    return addr


# Normalize addresses
df_subset["Address_norm"] = (
    df_subset["Address"]
    .astype(str)
    .apply(clean_address)
    .str.replace(" ,", ",", regex=False)
    .str.strip()
)

# Deduplicate address
unique_addresses = df_subset["Address_norm"].dropna().unique()
geo_cache = {}

print(f"Geocoding {len(unique_addresses)} unique addresses from {df.shape}")




CACHE_FILE = "../data/cleaned_data/geocode_cache.csv"
MAX_TO_PROCESS = 15000

# -----------------------------
# Load existing cache
# -----------------------------
if os.path.exists(CACHE_FILE):
    cache_df = pd.read_csv(CACHE_FILE)
    geo_cache = {
        row["address"]: (row["lat"], row["lng"], row["ok"])
        for _, row in cache_df.iterrows()
    }
else:
    geo_cache = {}

print(f"Loaded {len(geo_cache)} cached addresses")

# -----------------------------
# Prepare list to process
# -----------------------------
addresses_to_process = [
    addr for addr in unique_addresses
    if addr not in geo_cache
][:MAX_TO_PROCESS]

print(f"Need to geocode {len(addresses_to_process)} new addresses")

# -----------------------------
# Open CSV in append mode
# -----------------------------
file_exists = os.path.exists(CACHE_FILE)

with open(CACHE_FILE, "a", newline="", encoding="utf-8") as f:
    if not file_exists:
        f.write("address,lat,lng,ok\n")

    for addr in addresses_to_process:
        try:
            lat, lng, ok = geocode_address(addr)

            geo_cache[addr] = (lat, lng, ok)

            safe_addr = addr.replace('"', '""')  # CSV-safe
            f.write(f'"{safe_addr}",{lat},{lng},{ok}\n')
            f.flush()

            time.sleep(0.05)

        except Exception as e:
            print(f"Error for {addr}: {e}")
            continue


print("Geocoding batch complete")
