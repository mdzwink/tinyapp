const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const PORT = 8080;
const log = console.log;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"

};

function generateRandomString() {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += Math.floor(Math.random() * 10)
  }
  return randomString;
}


app.get('/', (req, res) => {
  res.send('Hello!!'); 
});

app.get('/hola', (req, res) => {
  res.send('Hola!!'); 
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World!.!</b></body></html>\n")
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase  };
  res.render('urls_index', templateVars);
})

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
})


app.post('/urls', (req, res) => {
  log('body from post>>>>>>>>>>', req.body)
  res.send(`Here is your random string: ${generateRandomString()}\n...use it wisely 0.0`);
})

app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});