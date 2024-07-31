const express = require('express');
const Axios = require("axios")
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

//Task 10
  let b= new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(books)
    },1000)
  });
 


public_users.get('/',async(req,res)=>{
    try{
    const books=await b;
    return res.json(books)
  } catch(error){
    res.status(500).json({'message':'Internal Server Error'})
  }

  
})
// public_users.get('/',function (req, res) {

//   return res.json(books)
 
// });

// Get book details based on ISBN

//Task 11
public_users.get('/isbn/:isbn',async(req,res)=>{
  const isbn=req.params.isbn;

  const bk=await new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(books[isbn])
    },1000)
  })
  return res.json(bk)
})
// public_users.get('/isbn/:isbn',function (req, res) {
  
//   const id=req.params.isbn;
  
//   return res.json(books[id])
//  });
  
// Get book details based on author
public_users.get('/author/:author',async(req,res)=>{
  const author=req.params.author;

  const bk=await new Promise((resolve)=>{
    let book;
    setTimeout(()=>{
       book=bk_array.find(val=>val.author===author)
       resolve(book)
    },1000)
  })
   const b={
  "isbn":bk.isbn,
  "title":bk.title,
  "reviews":bk.reviews
 }
 const result={
  "booksbyauthor":[b]
 }
 return res.json(result)
})
// public_users.get('/author/:author',function (req, res) {

//  const author=req.params.author;
//  const book=bk_array.find(val=>val.author===author)
//  const b={
//   "isbn":book.isbn,
//   "title":book.title,
//   "reviews":book.reviews
//  }

//  const result={
//   "booksbyauthor":[b]
//  }
//  res.json(result)
// });

// Get all books based on title

public_users.get('/title/:title',async(req,res)=>{
  const title=req.params.title;
  let t=new Promise((resolve)=>{
    let ti;
    setTimeout(()=>{
      resolve(bk_array.find(val=>val.title===title))
    },1000)
  })
  let bk=await t;
   const b={
  "isbn":bk.isbn,
  "author":bk.author,
  "reviews":bk.reviews
 }

 const result={
  "booksbytitle":[b]
 }
 res.json(result)
});
  



















// public_users.get('/title/:title',function (req, res) {
 
//    const title=req.params.title;
//    const book= bk_array.find(val=>val.title===title)
//    const b={
//     "isbn":book.isbn,
//     "author":book.author,
//     "reviews":book.reviews
//    }
  
//    const result={
//     "booksbytitle":b
//    }
//    res.json(result)
 
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.json(books[isbn].reviews)
});


module.exports.general = public_users;
