const express = require('express');
const app = express();
const PORT = 8080;
const log = console.log;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"
};

app.get('/hola', (req, res) => {
  res.send('Hola!!'); 
});

app.get('/', (req, res) => {
  res.send('Hello!!'); 
});

app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});