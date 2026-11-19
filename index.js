import express from 'express';
import renderApi from '@api/render-api';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('השרת פועל. נסי את /services');
});

app.get('/services', async (req, res) => {
  try {
    renderApi.auth(process.env.RENDER_API_KEY);
    const { data } = await renderApi.listServices({ includePreviews: 'true', limit: '20' });
    res.json(
  data.map(({ service }) => ({
    name: service.name,
    type: service.type,
    url: service.serviceDetails?.url,
    repo: service.repo,
  }))
);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
