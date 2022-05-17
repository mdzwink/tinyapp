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



app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL)
  delete urlDatabase[shortURL];
  log('item deleted')
  res.redirect('/urls');
})
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
})


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get('/urls/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})


app.post('/urls', (req, res) => {
  const reqRes = req.body.longURL
  const ranstr = generateRandomString();
  urlDatabase[ranstr] = reqRes;

  res.redirect(`/urls/${ranstr}`)
  log('body from post>>>>>>>>>>', req.body.longURL)
  log(urlDatabase)
  // res.redirect(`/urls/${shortURL}`);
})


app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase  };
  res.render('urls_index', templateVars);
})



app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});