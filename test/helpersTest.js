const { assert } = require('chai');

const { getUserbyEmail } = require('../helpers.js');

const testUsers = {
  'user@example.com': {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2@example.com": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserbyEmail("user@example.com", testUsers)
    const expectedUserEmail = "user@example.com";
    assert.equal(user, expectedUserEmail, 'should return object for user with provided email')
  });
});