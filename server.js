const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./skyhouse-462716-d55dd6fc3401.json');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Установите пакет cors: npm install cors

app.get('/api/products', async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet('1wUYcwESk90A8HcYUuQgoCkWhD4UJZqaz30m5IuT9s2Q');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      brand: row.brand,
      price: parseFloat(row.price),
      rating: parseFloat(row.rating),
      reviews: parseInt(row.reviews),
      instock: row.instock === 'TRUE',
      image: row.image
    }));
    
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});