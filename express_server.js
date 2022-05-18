const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.set('view engine', 'ejs');
// const morgan = require('morgan');// Doesn't work with nodemon??
// app.use(morgan(dev));
const PORT = 8080;
const log = console.log;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"
  
};
//----username---
let username;
//----username---
function generateRandomString() {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += Math.floor(Math.random() * 10)
  }
  return randomString;
}

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL]
  urlDatabase[shortURL] = req.body.longURL;
  log(shortURL);
  log('updated longURL')
  res.redirect('/urls');
})

app.get('/urls/:shortURL/edit', (req, res) => {//<<<<<<<<<<<<
  const templateVars = { username: username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
})

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  log(shortURL)
  log('item deleted')
  res.redirect('/urls');
})

app.post('/login', (req, res) => {
  username = req.body.username;
  log('Cookies: ', res.cookie('username', username))

  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  username = undefined;
  res.redirect('/urls')
})


app.get('/urls/new', (req, res) => {
  templateVars = { username: username };
  res.render('urls_new', templateVars);
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
  const templateVars = { username: username, urls: urlDatabase  };
  res.render('urls_index', templateVars);
})



app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});