# Backend

This contains a minimal Express + TypeScript backend with:
- `/api/check` — placeholder URL check
- `/api/admin/upload-training-data` — CSV upload (admin only)

Set `ADMIN_TOKEN` environment variable to a secret token for admin requests.
Uploads saved to `data/datasets/`.

Scripts:
- `npm run migrate` — placeholder
- `npm run seed` — creates seeded admins (example)
