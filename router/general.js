const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBookList() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Object.values(books));
    }, 1000);
  });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password){
    if(isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "registration successful!"});
    } else{
      return res.status(404).json({message: "user already exists"});
    }
  }
  return res.status(404).json({message: "can't register user"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const booksArr = await getBookList();
  return res.json(booksArr);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const booksArr = await getBookList();
  return res.json(booksArr.filter(book => book.ISBN === req.params.isbn));
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const booksArr = await getBookList();
  return res.json(booksArr.filter(book => book.author === req.params.author));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const booksArr = await getBookList();
  return res.json(booksArr.filter(book => book.title === req.params.title));
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  const booksArr = await getBookList();
  const filteredBooks = booksArr.filter(book => book.ISBN === req.params.isbn);
  return res.json(filteredBooks.map(book => book.reviews));
});

module.exports.general = public_users;
