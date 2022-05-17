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

app.post('/urls', (req, res) => {
  const reqRes = req.body.longURL
  const ranstr = generateRandomString();
  urlDatabase[ranstr] = reqRes;

  res.redirect(`/urls/${ranstr}`)
  log('body from post>>>>>>>>>>', req.body.longURL)
  log(urlDatabase)
  // res.redirect(`/urls/${shortURL}`);
})

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get('/urls/i', (req, res) => {
  const templateVars = { urls: urlDatabase  };
  res.render('urls_index', templateVars);
})

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  // const templateVars = { shortURL, longURL };
  //when /urls/:shortURL is directly accessd from the browser, should the client be redirected to the long url they provide only OR should a new short url be created and...
  res.redirect(longURL);
  // res.render('urls_show', templateVars);
})



app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});