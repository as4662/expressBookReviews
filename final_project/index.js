

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require('./router/booksdb.js');
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session management
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for routes starting with /customer/auth
app.use("/customer/auth/*", (req, res, next) => {
    console.log('Session:', req.session); 
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized access" });
    }
});

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Route to handle adding or updating reviews
app.put("/customer/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { reviewer, review } = req.query; // Extract reviewer and review from query parameters

    
    if (!reviewer || !review) {
        return res.status(400).json({ message: 'Reviewer and review must be provided' });
    }

    // Check if the book exists
    if (books[isbn]) {
        // Initialize reviews if not already present
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        // Add or update the review
        books[isbn].reviews[reviewer] = review;
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated` });
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
