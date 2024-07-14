const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user; Username or password not provided."});  
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {

   try {
    const data = await books;
    res.send(JSON.stringify(data, null, 4));
       }
    catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: 'Internal Server Error' });
   }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const getIsbnPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const data = books;
        resolve(data);
    }, 6000);
  });
  getIsbnPromise.then((bookData) => {
    let isbn = req.params.isbn;
    let filtered_isbn = Object.values(bookData).filter(book => book.isbn.includes(isbn));
    if(filtered_isbn.length === 0){
      return res.status(404).json({message: "Book with "+ filtered_isbn + " does not exist"});
    }
    res.send(JSON.stringify(filtered_isbn, null, 4));
  }).catch((error) => {
    console.error(error.toString());
    res.status(500).json({ error: 'Internal Server Error' });
  });


 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
    let author = req.params.author;
    const data = await books;
    let filtered_author = Object.values(data).filter(book => book.author.includes(author));
    if(filtered_author.length === 0){
      return res.status(400).json({message: "Book with "+ filtered_author + " does not exist"});
    }
    res.send(JSON.stringify(filtered_author, null, 4));
       }
    catch (error) {
      console.error(error.toString());
      res.status(500).json({ error: 'Internal Server Error' });
   }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
    let title = req.params.title;
    const data = await books;
    let filtered_title = Object.values(data).filter(book => book.title.includes(title));
    if(filtered_title.length === 0){
      return res.status(400).json({message: "Book with "+ filtered_title + " does not exist"});
    }
    res.send(JSON.stringify(filtered_title, null, 4));
       }
    catch (error) {
      console.error(error.toString());
    }

});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  const data = await books;
  let filtered_isbn = Object.values(data).filter(book => book.isbn.includes(isbn));
  if(filtered_isbn.length === 0){
    return res.status(400).json({message: "Book with "+ filtered_isbn + " does not exist"});
  }

  res.send(JSON.stringify(filtered_isbn[0].reviews, null, 4));
});

module.exports.general = public_users;
