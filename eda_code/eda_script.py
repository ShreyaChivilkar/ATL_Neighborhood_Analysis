# import os
# import pandas as pd

# # path to your folder containing the Excel files
# folder_path = r"D:\Fall2025\GRA\311 Data\data"

# for file in os.listdir(folder_path):
#     if file.endswith(".xlsx") or file.endswith(".xls"):
#         file_path = os.path.join(folder_path, file)
#         print(f"\n=== {file} ===")
        
#         try:
#             df = pd.read_excel(file_path)
#             print(list(df.columns))
#         except Exception as e:
#             print(f"Error reading {file}: {e}")

import pandas as pd
import matplotlib.pyplot as plt

# -----------------------------
# 1. Load the Excel file
# -----------------------------
file_path = r"D:\Fall2025\GRA\311_Data\data\data_2015.xlsx"  
df = pd.read_excel(file_path)

# -----------------------------
# 2. Quick overview
# -----------------------------
print("\n📌 First 5 rows:")
print(df.head())

print("\n📌 DataFrame Info:")
print(df.info())

print("\n📌 Summary Statistics (numeric):")
print(df.describe())

print("\n📌 Missing Values:")
print(df.isnull().sum())

# -----------------------------
# 3. Convert date columns
# -----------------------------
date_cols = ["Opened", "Closed Date"]
for col in date_cols:
    if col in df.columns:
        df[col] = pd.to_datetime(df[col], errors="coerce")

print("\n📌 Date conversion done!")

# -----------------------------
# 4. Add derived time columns
# -----------------------------
if "Opened" in df.columns and "Closed Date" in df.columns:
    df["Resolution Time (hours)"] = (df["Closed Date"] - df["Opened"]).dt.total_seconds() / 3600

print("\n📌 Resolution time stats:")
print(df["Resolution Time (hours)"].describe())

# -----------------------------
# 5. Top complaint types
# -----------------------------
print("\n📌 Top 10 request descriptions:")
print(df["Description"].value_counts().head(10))

# -----------------------------
# 6. Plotting simple charts
# -----------------------------

# --- Number of requests by postal code ---
df["Postal Code"].value_counts().head(10).plot(kind="bar", figsize=(8,4))
plt.title("Top 10 Postal Codes by Number of Requests")
plt.xlabel("Postal Code")
plt.ylabel("Count")
plt.show()

# --- Requests over time ---
df.set_index("Opened")["Service Request #"].resample("M").count().plot(figsize=(10,4))
plt.title("Requests Over Time (Monthly)")
plt.xlabel("Month")
plt.ylabel("Number of Requests")
plt.show()

# --- Resolution time distribution ---
df["Resolution Time (hours)"].plot(kind="hist", bins=30, figsize=(8,4))
plt.title("Distribution of Resolution Times")
plt.xlabel("Resolution Time (hours)")
plt.show()

