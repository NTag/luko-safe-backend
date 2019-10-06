const express = require('express');
const morgan = require('morgan');
const app = express();
const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
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

const itemSummary = (item) => {
  const item2 = { ...item };
  delete item2.image;
  return item2;
};
const findItem = (id) => {
  return items.find(item => item.id === id);
};
const itemWithDetails = (item) => {
  const category = CATEGORIES.find(c => c.value === item.category);

  return {
    ...item,
    category,
  };
};

app.get('/', (req, res) => res.send());
app.get('/items', (req, res) => res.send(items.map(itemSummary)));
app.get('/categories', (req, res) => res.send(CATEGORIES));
app.post('/items', async (req, res) => {
  const item2 = { ...req.body };
  delete item2.image;
  console.log('new item', item2);

  const imageBase64 = req.body.image;
  const imageBuffer = new Buffer(imageBase64, 'base64');
  const thumbnail = (await sharp(imageBuffer).resize(400).toBuffer()).toString('base64');

  const estimatedValue = [item2.purchaseValue * 0.6, item2.purchaseValue * 0.8]; // fake estimation
  const endWarrantyDate = moment(item2.purchaseDate).add(2, 'years'); // default French warranty

  const item = {
    ...req.body,
    thumbnail: thumbnail,
    id: uuidv4(),
    estimatedValue,
    endWarrantyDate,
  };

  items.unshift(item);
  console.log(`  ${items.length} items`);

  res.status(201).send({
    name: item.name,
    purchaseValue: item.purchaseValue,
  });
});
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  const item = findItem(id);
  if (!item) {
    return res.status(404).send();
  }
  res.send(itemWithDetails(item));
});

app.listen(port, () => console.log(`Luko safe backend running on port ${port}!`));
