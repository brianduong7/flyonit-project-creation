@AGENTS.md

# FOIT Projects Automation

Standalone Next.js app — separate from the FLYONIT website and AEMG Appraisal
projects, with its own git repo. Purpose: a Microsoft SSO-gated web form for
PMs to generate the official ERPNext project code/name (per the FLYONIT naming
convention: `[CLIENT_OR_DEPT]-[REGION]-[SERVICE]-[ENG_TYPE]-[###]`) and create
the project directly in ERPNext via its REST API. Access is restricted to the
configured SSO email allowlist.

- `lib/naming/` — naming convention constants and code/name generation logic.
- `lib/store.ts` — JSON-backed project register (`data/projects.json`), used
  as a stand-in until ERPNext is the system of record.
- `app/actions.ts` — server action that validates input, computes the next
  per-client sequence number, and generates the code.
- `app/auth/` — Microsoft Entra OAuth login and callback routes.
- ERPNext and Microsoft connection details go in `.env.local` (gitignored) —
  see `.env.example` for the required vars.
