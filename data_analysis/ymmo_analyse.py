import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from sklearn.linear_model import LinearRegression
import warnings
import json
import os

warnings.filterwarnings("ignore")

CSV_PATH   = "transactions_sample.csv"
OUTPUT_DIR = "ymmo_outputs"
PRIX_MIN   = 10_000

os.makedirs(OUTPUT_DIR, exist_ok=True)


#  1. CHARGEMENT ET NETTOYAGE
df = pd.read_csv(
    r"C:\Users\emmad\WebstormProjects\Ymmo_Web\data_analysis\transactions_sample.csv",
    low_memory=False
)

df["date_transaction"] = pd.to_datetime(df["date_transaction"], errors="coerce")
df["annee"]            = df["date_transaction"].dt.year
df["mois"]             = df["date_transaction"].dt.month

df["prix"] = pd.to_numeric(df["prix"], errors="coerce")
df = df[df["prix"] > PRIX_MIN].copy()

df["surface_habitable"] = pd.to_numeric(df["surface_habitable"], errors="coerce")
df = df[df["surface_habitable"] > 5].copy()

df["prix_m2"] = df["prix"] / df["surface_habitable"]

df = df[df["type_batiment"].isin(["Appartement", "Maison"])].copy()

#  2. STATS  GLOBALES
stats = {
    "Nb transactions"    : len(df),
    "Prix moyen (€)"     : int(df["prix"].mean()),
    "Prix médian (€)"    : int(df["prix"].median()),
    "Surface moyenne (m²)": round(df["surface_habitable"].mean(), 1),
    "Prix/m² moyen (€)"  : int(df["prix_m2"].mean()),
    "% Appartements"     : round((df["type_batiment"] == "Appartement").mean() * 100, 1),
    "% Maisons"          : round((df["type_batiment"] == "Maison").mean() * 100, 1),
}
for k, v in stats.items():
    print(f"   {k:<25} {v}")


#  3. ANALYSE PAR VILLE
ville_stats = (
    df.groupby("ville")
    .agg(
        nb_transactions  = ("prix", "count"),
        prix_moyen       = ("prix", "mean"),
        prix_median      = ("prix", "median"),
        surface_moyenne  = ("surface_habitable", "mean"),
        prix_m2_moyen    = ("prix_m2", "mean"),
    )
    .round(0)
    .sort_values("nb_transactions", ascending=False)
    .reset_index()
)

top10_villes = ville_stats.head(10)
print(f"   Top 5 villes par volume :")
for _, row in top10_villes.head(5).iterrows():
    print(f"   • {row['ville']:<15} {int(row['nb_transactions']):>6} transactions · prix moyen {int(row['prix_moyen']):,} €")

# Graphique
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle("Analyse par ville — Ymmo", fontsize=14, fontweight="bold", y=1.01)

axes[0].barh(
    top10_villes["ville"].str.capitalize()[::-1],
    top10_villes["nb_transactions"][::-1],
    color="#378ADD"
)
axes[0].set_title("Volume de transactions (top 10)")
axes[0].set_xlabel("Nombre de transactions")
axes[0].xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,}"))

top10_pm2 = ville_stats.sort_values("prix_m2_moyen", ascending=False).head(10)
axes[1].barh(
    top10_pm2["ville"].str.capitalize()[::-1],
    top10_pm2["prix_m2_moyen"][::-1],
    color="#639922"
)
axes[1].set_title("Prix moyen au m² (top 10)")
axes[1].set_xlabel("€/m²")
axes[1].xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,} €"))

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/01_analyse_villes.png", dpi=150, bbox_inches="tight")
plt.close()


#  4. ANALYSE PAR DÉPARTEMENT
dept_stats = (
    df.groupby("departement")
    .agg(
        nb_transactions = ("prix", "count"),
        prix_moyen      = ("prix", "mean"),
        prix_m2_moyen   = ("prix_m2", "mean"),
        surface_moyenne = ("surface_habitable", "mean"),
    )
    .round(0)
    .sort_values("nb_transactions", ascending=False)
    .reset_index()
)

top15_dept = dept_stats.head(15)

fig, ax = plt.subplots(figsize=(12, 5))
bars = ax.bar(
    top15_dept["departement"].astype(str),
    top15_dept["nb_transactions"],
    color="#7F77DD"
)
ax.set_title("Volume de transactions par département (top 15)", fontsize=13)
ax.set_xlabel("Département")
ax.set_ylabel("Nb transactions")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,}"))
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/02_analyse_departements.png", dpi=150, bbox_inches="tight")
plt.close()


#  5. ÉVOLUTION DES PRIX
evol = (
    df.groupby("annee")
    .agg(
        prix_moyen      = ("prix", "mean"),
        prix_median     = ("prix", "median"),
        prix_m2_moyen   = ("prix_m2", "mean"),
        nb_transactions = ("prix", "count"),
    )
    .round(0)
    .reset_index()
)
evol = evol[evol["annee"] >= 2010]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.suptitle("Évolution du marché immobilier — Ymmo", fontsize=14, fontweight="bold")

ax1.plot(evol["annee"], evol["prix_moyen"], marker="o", color="#378ADD", linewidth=2, label="Prix moyen")
ax1.plot(evol["annee"], evol["prix_median"], marker="s", linestyle="--", color="#D85A30", linewidth=2, label="Prix médian")
ax1.fill_between(evol["annee"], evol["prix_moyen"], alpha=0.1, color="#378ADD")
ax1.set_ylabel("Prix (€)")
ax1.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,} €"))
ax1.legend()
ax1.set_title("Prix moyen et médian par année")
ax1.grid(axis="y", alpha=0.3)

ax2.bar(evol["annee"], evol["nb_transactions"], color="#1D9E75", alpha=0.8)
ax2.set_ylabel("Nb transactions")
ax2.set_xlabel("Année")
ax2.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,}"))
ax2.set_title("Volume annuel de transactions")
ax2.grid(axis="y", alpha=0.3)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/03_evolution_temporelle.png", dpi=150, bbox_inches="tight")
plt.close()

#  6. PRÉDICTION DE PRIX
evol_clean = evol.dropna(subset=["prix_moyen"])
X = evol_clean[["annee"]].values
y = evol_clean["prix_moyen"].values

model = LinearRegression()
model.fit(X, y)

annees_futures = np.array([[2024], [2025], [2026]])
predictions    = model.predict(annees_futures)

for annee, pred in zip(annees_futures.flatten(), predictions):
    print(f"   Prévision {annee} : {int(pred):,} €")

fig, ax = plt.subplots(figsize=(11, 5))
annees_plot  = np.arange(evol_clean["annee"].min(), 2027)
prix_plot    = model.predict(annees_plot.reshape(-1, 1))

ax.scatter(evol_clean["annee"], evol_clean["prix_moyen"], color="#378ADD", zorder=5, label="Données réelles", s=60)
ax.plot(annees_plot[annees_plot <= evol_clean["annee"].max()], prix_plot[annees_plot <= evol_clean["annee"].max()],
        color="#378ADD", linewidth=2)
ax.plot(annees_plot[annees_plot >= evol_clean["annee"].max()], prix_plot[annees_plot >= evol_clean["annee"].max()],
        color="#D85A30", linewidth=2, linestyle="--", label="Prévision")
ax.scatter(annees_futures.flatten(), predictions, color="#D85A30", zorder=5, s=80, marker="D")

for annee, pred in zip(annees_futures.flatten(), predictions):
    ax.annotate(f"{int(pred):,} €", (annee, pred), textcoords="offset points",
                xytext=(0, 10), ha="center", fontsize=10, color="#D85A30")

ax.set_title("Prédiction du prix moyen — régression linéaire", fontsize=13)
ax.set_xlabel("Année")
ax.set_ylabel("Prix moyen (€)")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,} €"))
ax.legend()
ax.grid(axis="y", alpha=0.3)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/04_prediction_prix.png", dpi=150, bbox_inches="tight")
plt.close()


#  7. ZONES
zones = ville_stats[ville_stats["nb_transactions"] >= 30].copy()
zones["score_potentiel"] = (
                                   (zones["nb_transactions"] / zones["nb_transactions"].max()) * 0.4 +
                                   (1 - zones["prix_m2_moyen"] / zones["prix_m2_moyen"].max()) * 0.6
                           ) * 100

zones = zones.sort_values("score_potentiel", ascending=False)

for _, row in zones.head(5).iterrows():
    print(f"   • {row['ville']:<15} score {row['score_potentiel']:.0f}/100 · {int(row['prix_m2_moyen']):,} €/m²")

fig, ax = plt.subplots(figsize=(11, 6))
sc = ax.scatter(
    zones["nb_transactions"],
    zones["prix_m2_moyen"],
    c=zones["score_potentiel"],
    cmap="RdYlGn",
    s=80, alpha=0.75, edgecolors="white", linewidth=0.5
)
plt.colorbar(sc, ax=ax, label="Score potentiel (vert = meilleur)")

for _, row in zones.head(8).iterrows():
    ax.annotate(
        row["ville"].capitalize(),
        (row["nb_transactions"], row["prix_m2_moyen"]),
        textcoords="offset points", xytext=(6, 3), fontsize=9
    )

ax.set_title("Zones à fort potentiel — Volume vs Prix/m²", fontsize=13)
ax.set_xlabel("Nombre de transactions")
ax.set_ylabel("Prix moyen au m² (€)")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,} €"))
ax.grid(alpha=0.2)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/05_zones_potentiel.png", dpi=150, bbox_inches="tight")
plt.close()


#  8. JSON
export = {
    "stats_globales": stats,
    "evolution_annuelle": evol[["annee", "prix_moyen", "prix_median", "prix_m2_moyen", "nb_transactions"]].to_dict(orient="records"),
    "top_villes": top10_villes.head(12).to_dict(orient="records"),
    "top_departements": dept_stats.head(15).to_dict(orient="records"),
    "zones_potentiel": zones.head(10)[["ville", "nb_transactions", "prix_moyen", "prix_m2_moyen", "score_potentiel"]].to_dict(orient="records"),
    "predictions": [{"annee": int(a), "prix_predit": int(p)} for a, p in zip(annees_futures.flatten(), predictions)],
}

with open(f"{OUTPUT_DIR}/ymmo_data.json", "w", encoding="utf-8") as f:
    json.dump(export, f, ensure_ascii=False, indent=2)

