import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import renderApi from '@api/render-api';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// מגיש את הקבצים מתיקיית public (כולל index.html בכתובת הראשית)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/services', async (req, res) => {
  try {
    renderApi.auth(process.env.RENDER_API_KEY);
    const { data } = await renderApi.listServices({ includePreviews: 'true', limit: '20' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});