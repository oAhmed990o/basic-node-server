const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if (username.length > 0){
    return !users.some(user => user.username === username);
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user["username"] === username && user["password"] === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  if (authenticatedUser(req.body.username, req.body.password)){
    const token = jwt.sign(
      {
        username: req.params.username,
        password: req.params.password,
      },
      'serryGeddan',
      {expiresIn: '1h'}
    );
    return res.status(200).json({
        token,
        message: "login successful!"
    });
  } else{
    return res.status(404).json({message: "account doesn't exist"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const username = req.headers.authorization;

  if (!username || !users[username]) {
    return res.status(401).json({ message: "No token" });
  }

  const booksArr = Object.values(books);
  const book = res.json(booksArr.filter(book => book.ISBN === req.params.isbn));
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  book.review[username] = review;
  return res.status(200).json({ message: 'Review added successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
