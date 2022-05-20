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


const urlDatabase = {//where it was urlDatabase[shortURL], //it is now urlDatabase[shortURL].(longURL OR userID)
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
}


const randomStr = function() {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += Math.floor(Math.random() * 10);
  }
  return randomString;
}

const emailChecker = function(email) {
    if (userList[email]) {
      return true;
    };
  return false;
} 

const authenticateUser = function(uID) {
  for (let user in userList) {
    const email = userList[user].email;
    if (userList[user].id === uID) {
      return { varified: true, email: email };
    }
  }
  return { varified: false, email: null};
}

const urlsForUser = function(user_id) {
  let userLibrary = {}
  for (let url in urlDatabase) {
    log('url from ursForUser fn:',url)
    if (user_id === urlDatabase[url].userID) {
      userLibrary[url] = urlDatabase[url];
      log('urlsForUser:', urlDatabase[url])
    }
  }
  log('from urlsForUser fn:', userLibrary)
  return userLibrary
}



app.get('/register', (req, res) => {
  const templateVars = { loggedin: false };
  res.render('urls_register', templateVars);
})
app.post('/register', (req, res) => {//<<< refacter
  const  { email, password } = req.body; 
  if (!email) {
    return res.sendStatus(400)
  } else if (emailChecker(email)) {
    return res.sendStatus(400)
  } 
  const id = randomStr();
  userList[email] = { id, email, password }
  res.cookie('user_id', userList[email].id);
  res.redirect('/urls');
})

app.get('/login', (req, res) => {
  const templateVars = { loggedin: false };
  res.render('urls_login', templateVars)
})
app.post('/login', (req, res) => {
  const  { email, password } = req.body; 
  log('from login.............', req.body)
  if (!email) {

    log('>>>user did not enter email<<<')
    return res.sendStatus(403)
  }
  else if (emailChecker(email)) {
    if (userList[email].password === password) {
      console.log('we are in the if')
      log('Cookies: ', res.cookie('user_id', userList[email].id));
      return res.redirect('/urls');
    }
  }
  return res.sendStatus(403)
})
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})



app.get('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { loggedin: authenticateUser(req.cookies.user_id), shortURL: shortURL, longURL: urlDatabase[shortURL].longURL };
  res.render('urls_show', templateVars);
})
app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
})
app.post('/urls/:shortURL/delete', (req, res) => {
  if (authenticateUser(req.cookies.user_id).varified) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    log('item deleted');
  }
  res.redirect('/urls');
})



app.get('/urls/new', (req, res) => {
  const templateVars = { loggedin: authenticateUser(req.cookies.user_id)};
  if (templateVars.loggedin.varified) {
    res.render('urls_new', templateVars);
  }
  res.redirect('/login')
})
app.post('/urls', (req, res) => {
  const user_id = req.cookies.user_id;
  if (authenticateUser(user_id).varified) {
    const newLongURL = req.body.longURL;
    const newShortURL = randomStr()
    urlDatabase[newShortURL] = { longURL: newLongURL, userID: user_id}
  }
  res.redirect('/urls');
})




app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
  res.sendStatus(400)
})

//what do i have
  //i have a cookie with
  //-user_id
  //urlDatabase
  //urlsForUser fn
//what do i want
  //
  //how do i access what want

app.get('/urls', (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = { loggedin: authenticateUser(user_id), userURLs: urlsForUser(user_id) };
  log('>>>>> authenticator output:>>>', authenticateUser(user_id))
  res.render('urls_index', templateVars);
  // log('user:>>>>>>>>>>', userList)
})



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});
