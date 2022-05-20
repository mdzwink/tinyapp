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

const urlDatabase1 = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  "9sm5xK": "http://www.google.com"
  
};

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
  'user@ecample.com':  {
                          id: "rand user id",
                          email: 'user@ecample.com',
                          password: 'purple-lotus-stretch'
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

const authenticateUser1 = function (uID){
  for (let user in userList) {
    if (userList[user].id === uID) {
      return true;
    }
  }
  return false;
}
const authenticateUser = function (uID){
  for (let user in userList) {
    const email = userList[user].email;
    if (userList[user].id === uID) {
      return { varified: true, email: email };
    }
  }
  return { varified: false, email: null};
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
app.post('/login', (req, res) => {//<<<<<<<<<<<<<<<<<<<<username/user(obj) update needed
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
  const templateVars = { loggedin: authenticateUser(req.cookies.user_id), shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render('urls_show', templateVars);
})
app.post('/urls/:shortURL/update', (req, res) => {
  const { shortURL, longURL } = req.body;
  urlDatabase[shortURL]['longURL'] = longURL;
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
  const templateVars = { loggedin: authenticateUser(req.cookies.user_id), userList: req.cookie };
  if (templateVars.loggedin.varified) {
    res.render('urls_new', templateVars);
  }
  res.redirect('/login')
})




app.get('/urls/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})
app.get('/urls', (req, res) => {
  const templateVars = { loggedin: authenticateUser(req.cookies.user_id), urls: urlDatabase  };
  log('>>>>> authenticator output:>>>', authenticateUser(req.cookies.user_id))
  res.render('urls_index', templateVars);
  // log('user:>>>>>>>>>>', userList)
})
app.post('/urls', (req, res) => {
  if (authenticateUser(req.cookies.user_id).varified) {
    const reqRes = req.body.longURL;
    const ranstr = randomStr();
    urlDatabase[ranstr] = reqRes;
  }
  
  res.redirect('/urls');
})



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  log(`Example app listening on port ${PORT}!`);
});
