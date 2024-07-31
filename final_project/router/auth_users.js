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

// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   const isbn=req.params.isbn;
//   // const { reviewer } = req.query; // Get reviewer from query parameters
//   const { reviewer,review } = req.query; // Get review from query parameters
//   // books[isbn].reviews[reviewer]=review;
  
//   // return res.json({message:`The review for the book with ISBN ${isbn} has been added/updated`})
//   if (books[isbn]) {
//     if (!books[isbn].reviews) {
//       books[isbn].reviews = {};
//     }
//     books[isbn].reviews[reviewer] = review;
//     return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated` });
//   } else {
//     return res.status(404).json({ message: 'Book not found' });
//   }
// });

// regd_users.delete("/delete",(req,res)=>{
//   const {username,password}=req.body;
//   users = users.filter(user => user.username !== username);
//   res.json({message:"Deleted"})
// })

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
