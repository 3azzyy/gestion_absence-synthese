# ISTA Absence Management — Claude Code Context

This file is read automatically at the start of every conversation.
This project follows the shared conventions in `../_meta/CONVENTIONS.md`.

---

## ⚠️ CRITICAL — this points at a LIVE PRODUCTION server and database

Both `.env` (frontend) and `backend/.env` are currently configured against the
**real production server**: `https://absence.compusmanager.com/api`, with a real
hosted MySQL database (`u701914356_absence`) and real credentials committed in
`backend/.env`. There is no local/staging separation right now.

**Before editing anything that touches data** (not just UI polish), either:
- Point `VITE_API_BASE_URL` (root `.env`) and `APP_URL`/`DB_*` (`backend/.env`)
  at a local Laravel dev server + local DB instead, or
- Be deliberate that you intend to touch production.

Do not assume "just running the dev server" is safe here the way it normally is.

---

## What This Project Is

A trainee absence-tracking system for ISTA/OFPPT — "SUIVI ABSENCE DES STAGIAIRES"
(trainee absence tracking). React 19 + Vite frontend, Laravel backend (`backend/`),
plus standalone Python scripts (`python/`) that convert the school's raw Excel
attendance sheets into per-class JSON used to seed/import data.

## Project History (why this repo exists)

This is the consolidated/final version of a project that went through several
false starts under different working names before landing here — `absence`,
`absence2`, `absence3` (as "GestionRH_OFPPT"), `absence4` (as "gestion_emploi_co_4"),
`absence5`. Those are archived (not deleted) on the external backup drive; this repo
is the one to actively work in. It was created as a clean re-packaging of `absence2`
on 2026-05-30 (22 minutes after absence2's last commit) — same backend, same `.env`,
effectively the canonical continuation of that work.

## Architecture

```
Browser ──► React/Vite frontend (src/) ──axios──► Laravel API (backend/)
                                                        │
                                                    MySQL (production,
                                                    absence.compusmanager.com)

Python scripts (python/) ──► read raw Excel sheets ──► write per-class JSON
                              (offline data-prep step, not part of the live app)
```

- `src/services/http.js` — axios client, base URL from `VITE_API_BASE_URL`
- `src/importclasses/` — frontend-side class import UI
- `backend/routes/api.php` — Laravel API routes

## Data files (`python/`)

- `SUIVI ABSENCE DES STAGIAIRES 2.xlsx`, `SUIVI ABSENCE DES STAGIAIRES deux eme annee.xlsx`
  — the real source attendance spreadsheets from ISTA.
- `SUIVI ABSENCE DES STAGIAIRES deux eme annee.csv`, `classes.json` — companion
  data files (copied in from the old `absence/` folder during the 2026-09
  reorg — they were missing from this repo before that).
- `pythonscript.py` — converts the Excel sheets into per-class JSON
  (`jsonfiles/1er annee/`, `jsonfiles/2eme annee/`). **Paths were hardcoded to
  the old `absence2` folder until 2026-09 — fixed to be relative to this
  script's own folder.** If you find more hardcoded `absence2` paths elsewhere
  in `python/`, they're leftover from the same issue — redirect them here.
- `excelClasses/GEOCF203.xlsx` — a single-class reference file, separate from
  the two main sheets above.

## Build / Run

```bash
# Frontend
npm install
npm run dev        # vite dev server
npm run build       # production build
npm run test:e2e    # playwright, chromium

# Backend (from backend/)
composer install
php artisan migrate
php artisan serve

# Python data-prep (from python/)
python pythonscript.py
```

## Status

| Piece | Status |
|---|---|
| Frontend (React/Vite) | ✅ Working, connected to production API |
| Backend (Laravel) | ✅ Working, live on absence.compusmanager.com |
| Python data-prep scripts | ✅ Working (path bug fixed 2026-09) |
| Local/staging environment | 🔲 Not set up — currently prod-only |
