const getUserByEmail = function (email, database) {
    if (database[email]) {
      return database[email];//<<< return email as well
    };
    return false;
} 



const randomStr = function() {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += Math.floor(Math.random() * 10);
  }
  return randomString;
}


const authenticateUser = function(uID, userList) {
  for (let user in userList) {
    const email = userList[user].email;
    if (userList[user].id === uID) {
      return { varified: true, email: email };
    }
  }
  return { varified: false, email: null};
}

const authenticateOwnership = function(userEmail, shortURL, userList, urlDatabase) {
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userList[userEmail].id) {
    return true;
  }
  return false;
}

const urlsForUser = function(user_id, urlDatabase) {
  let userLibrary = {};
  for (let url in urlDatabase) {
    if (user_id === urlDatabase[url].userID) {
      userLibrary[url] = urlDatabase[url];
    }
  }
  return userLibrary;
}


module.exports = { randomStr, getUserByEmail, authenticateUser, authenticateOwnership, urlsForUser };