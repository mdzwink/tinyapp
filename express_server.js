const express = require('express');
const app = express();
const PORT = 8080;
const log = console.log;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"
};


app.get('/', (req, res) => {
  res.send('Hello!!'); 
});

app.get('/hola', (req, res) => {
  res.send('Hola!!'); 
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World!.!</b></body></html>\n")
});

app.get("/urls.json", (req, res) => {
  log('json is here')
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});