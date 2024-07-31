const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bk_array= Object.entries(books).map(([isbn,book])=>({isbn,...book}))

public_users.post("/register",(req,res)=>{
  const {username,password}=req.body;
  const existingUser = users.some(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  if(!isValid(username)){
    return res.status(400).json({message:'Invalid Username'})
  }

  users.push({username:username,password:password})
  return res.status(200).json({message:"Customer successfully registered now you can login"})
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json(books)
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const id=req.params.isbn;
  
  return res.json(books[id])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 const author=req.params.author;
 const book=bk_array.find(val=>val.author===author)
 const b={
  "isbn":book.isbn,
  "title":book.title,
  "reviews":book.reviews
 }

 const result={
  "booksbyauthor":[b]
 }
 res.json(result)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const title=req.params.title;
   const book= bk_array.find(val=>val.title===title)
   const b={
    "isbn":book.isbn,
    "author":book.author,
    "reviews":book.reviews
   }
  
   const result={
    "booksbytitle":b
   }
   res.json(result)
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.json(books[isbn].reviews)
});


module.exports.general = public_users;
