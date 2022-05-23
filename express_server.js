const { randomStr, getUserByEmail, authenticateUser, authenticateOwnership, urlsForUser } = require('./helpers');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'user_id',
  keys: ['simplebutpowerfull']
}));
app.set('view engine', 'ejs');
// const morgan = require('morgan');// Doesn't work with nodemon??
// app.use(morgan(dev));
const bcrypt = require('bcryptjs');
const PORT = 8080;
const log = console.log;


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


const userList = { //<<<change name back to users??
  'admin@tinyApp.pro':  {
    id: "aJ48lW",
    email: 'admin@tinyApp.pro',
    password: ''
  },
};



app.get('/register', (req, res) => {
  if (authenticateUser(req.session.user_id, userList).varified) {
    return res.redirect('/urls');
  }
  const templateVars = { loggedin: false };
  res.render('urls_register', templateVars);
});
app.post('/register', (req, res) => {
  const id = randomStr();
  const  { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    return res.sendStatus(400);
  } else if (getUserByEmail(email, userList)) {
    return res.sendStatus(400);
  }
  userList[email] = { id, email, hashedPassword };
  req.session.user_id = userList[email].id;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  if (authenticateUser(req.session.user_id, userList).varified) {
    return res.redirect('/urls');
  }
  const templateVars = { loggedin: false };
  res.render('urls_login', templateVars);
});
app.post('/login', (req, res) => {
  const  { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(403);
  }
  if (getUserByEmail(email, userList)) {
    const loginpwd = password.toString();
    const hashedPassword = userList[email].hashedPassword;
    if (bcrypt.compareSync(loginpwd, hashedPassword)) {
      req.session.user_id = userList[email].id;
      return res.redirect('/urls');
    }
  }
  res.sendStatus(403);
});
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  const authUser = authenticateUser(req.session.user_id, userList);
  if (authUser.varified) {
    const templateVars = {loggedin: authUser};
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
});

app.get('/urls/:shortURL', (req, res) => {
  const uID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const authUser = authenticateUser(uID, userList);
  if (!authUser.varified) {
    return res.sendStatus(404).send('Please log in to access your short URLs');
  }
  if (!authenticateOwnership(authUser.email, shortURL, userList, urlDatabase)) {
    return res.send('Error: This short URL does not exist or is not registered under this account.');
  }
  const templateVars = { loggedin: authenticateUser(req.session.user_id, userList), shortURL: shortURL, longURL: urlDatabase[shortURL].longURL };
  res.render('urls_show', templateVars);
});
app.post('/urls/:shortURL', (req, res) => {
  if (authenticateUser(req.session.user_id, userList).varified) {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
    return res.redirect('/urls');
  }
  res.sendStatus(403);
});
app.post('/urls/:shortURL/delete', (req, res) => {
  if (authenticateUser(req.session.user_id, userList).varified) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    log('item deleted');
    return res.redirect('/urls');
  }
  res.sendStatus(403);
});



app.post('/urls', (req, res) => {
  const user_id = req.session.user_id;
  if (authenticateUser(user_id, userList).varified) {
    const newLongURL = req.body.longURL;
    const newShortURL = randomStr();
    urlDatabase[newShortURL] = { longURL: newLongURL, userID: user_id};
    return res.redirect(`/urls/${newShortURL}`);
  }
  res.redirect('/urls');
});



// change to /u/.., send html instead of status code
app.get('/urls/:shortURL', (req, res) => {
  const userAuth = authenticateUser(req.session.userID, userList);
  const userEmail = userAuth.email;
  const shortURL = req.params.shortURL;
  console.log('From shortURL req', urlDatabase[shortURL]);
  if (!authenticateUser(req.session.userID).varified) {
    return res.status(404).send('Error: Please log in to access records.');
  }
  if (!urlDatabase[shortURL] || urlDatabase[shortURL].userID !== userList[userEmail].id) {
    return res.send('Error: This short URL does not exist or is not registered under this account.');
  }
  res.redirect('user/:shortURL/edit');
});

app.get('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const templateVars = { loggedin: authenticateUser(user_id, userList), userURLs: urlsForUser(user_id, urlDatabase) };
  log('>>>>> authenticator output:>>>', authenticateUser(user_id, userList));
  res.render('urls_index', templateVars);
});

app.get('/u/:id', (req, res) => {
  const shortURL = req.params.id;
  if (urlDatabase[shortURL]) {
    return res.redirect(urlDatabase[shortURL]['longURL']);
  }
  res.send('Error: this short URL seems to be missing or non existant');
});

app.get('/', (req, res) => {
  if (authenticateUser(req.session.user_id, userList).varified) {
    return res.redirect('/urls');
  }
  res.redirect('/login');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});
