import requests
from urllib.parse import quote

API_KEY = ""

BASE = "https://geocode.googleapis.com/v4beta/geocode/address"

HEADERS = {
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "*"
}


def geocode_request(query: str):
    """Call new v4beta API and return raw JSON"""
    url = f"{BASE}/{quote(query, safe='')}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}
    

def geocode_address(address: str):
    data = geocode_request(address)

    print("RAW RESPONSE:", data)

    if "error" in data:
        return None

    # v4beta structure parsing
    try:
        result = data["results"][0]

        lat = result["location"]["latitude"]
        lng = result["location"]["longitude"]

        formatted = result.get("formattedAddress", address)

        return {
            "latitude": lat,
            "longitude": lng,
            "formatted_address": formatted,
        }

    except Exception:
        return None


# ── Test ─────────────────
print(
    geocode_address(
        "3430 HOGAN RD SW, ATLANTA, GA, 30331"
    )
)

