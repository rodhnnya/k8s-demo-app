const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello Metal World!');
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.listen(port, () => {
  console.log(`App listening at http://0.0.0.0:${port}`);
});
