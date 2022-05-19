const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');
// const morgan = require('morgan');// Doesn't work with nodemon??
// app.use(morgan(dev));
const PORT = 8080;
const log = console.log;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"
  
};

const users = { 
  'firstUser': {
    id: "rand user id",
    email: 'user@ecample.com',
    password: 'purple-lotus-stretch'
  },
  
}



//
let currentUser;
//^^^^^^^ stored current user profile


const randomStr = function() {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += Math.floor(Math.random() * 10);
  }
  return randomString;
}

const emailChecker = function(email) {
  for (let user in users) {
    if (users[user]['email'] === email) {
      console.log(user)
      return true;
    };
  }
  return false;
} 


app.get('/register', (req, res) => {
  templateVars = { currentUser: currentUser };
  res.render('urls_register', templateVars);
})
app.post('/register', (req, res) => {
  log('users before registration>>>>>>>>>>>', users);
  const id = randomStr();
  const userKey = `user${id}`
  const newUseremail = req.body.email;
  if (!newUseremail || emailChecker(newUseremail)) {
    res.sendStatus(400)
    res.send('This is an error...')
  }
  const newUserpassword = req.body.password;//<<<can i just add assign the body object to a variable then add the id and have my user profile?? skipping this and the next step entirely?
  const newUser = { 'id': id, 'email': newUseremail, 'password': newUserpassword }
  users[userKey] = newUser;
  log('Cookies: ', res.cookie('user_id', id));
  currentUser = users[userKey];
  log('new user profile created, tasty cookie despensed 🍪 :P\n>>>>>', currentUser, '<<<<<');
  log('users after registration>>>>>>>>>>>', users);

  res.redirect('/urls');
})
app.get('/login', (req, res) => {
  templateVars = { currentUser: currentUser };
  res.render('urls_login', templateVars)
})
app.post('/login', (req, res) => {//<<<<<<<<<<<<<<<<<<<<username/user(obj) update needed
  const { email, password } = req.body;
  
  if (!emailChecker(email)) {
    res.sendStatus(403)
  }
  log('Cookies: ', res.cookie('user_id', id));

  res.redirect('/login');
})
app.post('/logout', (req, res) => {
  res.clearCookie('currentUser.id');
  currentUser = undefined;//        <<<<<<<<<<cheating, how can I relate cookie lookup directly at browser stored cookie??
  log('logout attempt', 'logged currentUser', currentUser)//                                        ^^^^^^^^^^^^^^^^^^^
  res.redirect('/urls');
})



app.get('/urls/:shortURL/edit', (req, res) => {
  const templateVars = { currentUser: currentUser, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
})
app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  urlDatabase[shortURL] = req.body.longURL;
  log(shortURL);
  log('updated longURL');
  res.redirect('/urls');
})
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  log('item deleted');
  res.redirect('/urls');
})



app.get('/urls/new', (req, res) => {
  templateVars = { currentUser: currentUser };
  res.render('urls_new', templateVars);
})




app.get('/urls/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})
app.get('/urls', (req, res) => {
  const templateVars = { currentUser: currentUser, urls: urlDatabase  };
  res.render('urls_index', templateVars);
  // log('user:>>>>>>>>>>', currentUser)
})
app.post('/urls', (req, res) => {
  const reqRes = req.body.longURL;
  const ranstr = randomStr();
  urlDatabase[ranstr] = reqRes;
  
  res.redirect('/urls');
  log('body from post>>>>>>>>>>', req.body.longURL);
  log(urlDatabase);
  // res.redirect(`/urls/${shortURL}`);
})



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});
