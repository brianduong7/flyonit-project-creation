@AGENTS.md

# FOIT Projects Automation

Standalone Next.js app — separate from the FLYONIT website and AEMG Appraisal
projects, with its own git repo. Purpose: a web form for PMs to generate the
official ERPNext project code/name (per the FLYONIT naming convention:
`[CLIENT_OR_DEPT]-[REGION]-[SERVICE]-[ENG_TYPE]-[###]`) and eventually create
the project directly in ERPNext via its REST API.

- `lib/naming/` — naming convention constants and code/name generation logic.
- `lib/store.ts` — JSON-backed project register (`data/projects.json`), used
  as a stand-in until ERPNext is the system of record.
- `app/actions.ts` — server action that validates input, computes the next
  per-client sequence number, and generates the code.
- ERPNext connection details go in `.env.local` (gitignored) — see
  `.env.example` for the required vars (`ERPNEXT_URL`, `ERPNEXT_API_KEY`,
  `ERPNEXT_API_SECRET`).
