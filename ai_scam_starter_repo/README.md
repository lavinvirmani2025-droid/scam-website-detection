# AI Scam Detector — Starter Repo

This starter repository scaffolds the project you requested:
- React frontend (placeholder)
- Admin panel pages (placeholder)
- Express + TypeScript backend with CSV upload endpoint
- PostgreSQL migrations and seed script to create 3 admin users
- Backup scripts for macOS and Windows
- `docs/initial-proposal.docx` included (your uploaded file)

## Quickstart (development)

### Backend
1. Install dependencies (Node 18+):
```bash
cd backend
npm install
```
2. Create `.env` from `.env.example` and set DB credentials.
3. Run migrations and seed:
```bash
npm run migrate
npm run seed
```
4. Start server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

See more detailed instructions in `backend/README.md` and `frontend/README.md`.
