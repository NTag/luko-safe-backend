const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 8080;

app.use(morgan('combined'));
app.use(express.json({ limit: '20MB' }));

const CATEGORIES = [
  { label: 'Art', value: 'cat-1' },
  { label: 'Electronics', value: 'cat-2' },
  { label: 'Jewelry', value: 'cat-3' },
  { label: 'Music instruments', value: 'cat-4' },
];

const items = [];

app.get('/', (req, res) => res.send());
app.get('/items', (req, res) => res.send(items));
app.get('/categories', (req, res) => res.send(CATEGORIES));
app.post('/items', (req, res) => {
  console.log('new item — name:', req.body.name);
  items.unshift(req.body);
  console.log(`  ${items.length} items`);
  res.status(201).send({});
});

app.listen(port, () => console.log(`Luko safe backend running on port ${port}!`));
