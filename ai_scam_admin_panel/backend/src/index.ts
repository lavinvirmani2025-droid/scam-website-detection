import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, '../../uploads') });

// Simple admin-check middleware (placeholder: check header 'x-admin-token' equals seeded token)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-PLACEHOLDER';
function requireAdmin(req, res, next) {
  const t = req.header('x-admin-token');
  if (t === ADMIN_TOKEN) return next();
  return res.status(403).json({ error: 'admin required' });
}

// CSV upload endpoint
app.post('/api/admin/upload-training-data', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'missing file' });
  // Basic server-side CSV validation: check extension and size
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (ext !== '.csv') {
    // remove file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'only .csv allowed' });
  }
  // move to datasets folder
  const destDir = path.join(__dirname, '../../data/datasets');
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, req.file.originalname);
  fs.renameSync(req.file.path, dest);
  // In a real system we'd queue this for validation/training
  return res.json({ status: 'uploaded', path: `data/datasets/${req.file.originalname}` });
});

// Simple health and check endpoints

// Admin-only DB preview (read-only) - returns latest 50 reports
app.get('/api/admin/db-preview', requireAdmin, (req, res) => {
  // In a real app, query the database. Here we return the seed file if present.
  try {
    const seedPath = path.join(__dirname, '../data/seeded_admins.json');
    let sample = [];
    if (fs.existsSync(seedPath)) {
      sample = JSON.parse(fs.readFileSync(seedPath,'utf-8'));
    }
    // Sample reports placeholder
    const reports = [
      { id: 1, url: 'http://phish.example', status: 'pending', created_at: '2025-10-01' },
      { id: 2, url: 'http://bad.example', status: 'approved', created_at: '2025-10-02' }
    ];
    return res.json({ rows: reports, admins: sample });
  } catch (err) {
    return res.status(500).json({ error: 'failed to read DB' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok:true }));
app.get('/api/check', (req, res) => {
  const url = String(req.query.url || '');
  if(!url) return res.status(400).json({ error: 'url required' });
  // placeholder: return suspicious randomly
  return res.json({ verdict: 'suspicious', confidence: 0.72, source: 'ai' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
