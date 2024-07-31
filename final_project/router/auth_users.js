const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const url=require("url")
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 return users.some(user=>user.username===username && user.password===password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password}=req.body;
  if(!isValid(username)){
    return res.status(400).json({message:'Invalid Username'})
  }
  if (authenticatedUser(username, password)) {
    req.session.user =  username ;
    return res.status(200).json({ message: 'Customer successfully logged in' });
  } else {
    return res.status(401).json({ message: 'Customer login unsucessful' });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const {username,password}=req.body;
  // Check if the book exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Check if the reviews property exists on the book
  if (!books[isbn].reviews) {
    return res.status(404).json({ message: 'No reviews found for this book' });
  }

  // Check if the review by the specified user exists
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'No such user exists' });
  }


  delete books[isbn].reviews[username];

 res.status(200).json({ message: `Review for ISBN ${isbn} by user ${username} deleted` });

})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
