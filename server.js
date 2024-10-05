const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Server listening port
const PORT = 3000;

// Secret key used to sign JWTs
const secretKey = 'My super secret key';

// Middleware to protect routes with JWT
const jwtMW = expressjwt({
    secret: secretKey,
    algorithms: ['HS256'] // Make sure this algorithm matches when signing tokens
});

// Example users data
let users = [
    {
        id: 1,
        username: 'Sri Harini',
        password: '123'
    },
    {
        id: 2,
        username: 'Sriram',
        password: '456'
    }
];

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let userFound = false;

    // Check if username and password match any user
    for (let user of users) {
        if (username === user.username && password === user.password) {
            // If match found, generate JWT token
            let token = jwt.sign(
                { id: user.id, username: user.username },
                secretKey,
                { expiresIn: '3m' } // Token valid for 3 minutes
            );
            res.json({
                success: true,
                err: null,
                token
            });
            userFound = true;
            break; // Stop searching once a match is found
        }
    }

    // If no matching user is found, return 401 Unauthorized
    if (!userFound) {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
});

// Protected dashboard route, only accessible with a valid JWT
app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
});
app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is the price $3.99'
    });
});
// Serve the `index.html` file from the root route (for the login page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Protected settings route, only accessible with a valid JWT
app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'You can change any settings here!'
    });
});

// Serve the `index.html` file from the root route (for the login page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler for unauthorized access (JWT token validation errors)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Invalid token or unauthorized access'
        });
    } else {
        next(err);
    }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
















// const express = require('express');
// const app = express();
// const jwt = require('jsonwebtoken');
// const { expressjwt } = require('express-jwt');
// const bodyParser = require('body-parser');
// const path = require('path');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Fixed CORS headers (with correct localhost URL and quotes)
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Corrected the typo here
//     res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
//     next();
// });

// const PORT = 3000;
// const secretKey = 'My super secret key';

// // JWT middleware for protected routes
// const jwtMW = expressjwt({
//     secret: secretKey,
//     algorithms: ['HS256'] // Make sure this matches the algorithm used for signing the token
// });

// let users = [
//     {
//         id: 1,
//         username: 'Sri Harini',
//         password: '123'
//     },
//     {
//         id: 2,
//         username: 'Sriram',
//         password: '456'
//     }
// ];

// // Login route (fixed logic to prevent sending 401 prematurely)
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;
//     let userFound = false;

//     for (let user of users) {
//         if (username === user.username && password === user.password) {
//             // If user is found and credentials are correct, generate token
//             let token = jwt.sign(
//                 { id: user.id, username: user.username },
//                 secretKey,
//                 { expiresIn: '7d' } // Token valid for 7 days
//             );
//             res.json({
//                 success: true,
//                 err: null,
//                 token
//             });
//             userFound = true;
//             break; // Stop looping once the user is found
//         }
//     }

//     if (!userFound) {
//         // If no matching user is found, return a 401 error
//         res.status(401).json({
//             success: false,
//             token: null,
//             err: 'Username or password is incorrect'
//         });
//     }
// });

// // Protected dashboard route (requires JWT token)
// app.get('/api/dashboard', jwtMW, (req, res) => {
//     res.json({
//         success: true,
//         myContent: 'Secret content that only logged in people can see!!!'
//     });
// });

// // Serve index.html (for your login page)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Error handler for UnauthorizedError from JWT validation
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({
//             success: false,
//             officialError: err,
//             err: 'Username or password is incorrect 2'
//         });
//     } else {
//         next(err);
//     }
// });

// // Fix for incorrect string interpolation in port logging
// app.listen(PORT, () => {
//     console.log(`Serving on port ${PORT}`); // Backticks used for template literals
// });





// const express = require('express');
// const app = express();

// const jwt = require('jsonwebtoken');

// const { expressjwt } = require('express-jwt');
// const bodyParser = require('body-parser');
// const path = require('path');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use((req,res,next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost":3000');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
//     next();
// });

// const PORT = 3000;

// const secretKey = 'My super secret key';
// const jwtMW = expressjwt({
//     secret: secretKey,
//     algorithms: ['HS256']
// });

// let users = [
//     {
//         id: 1,
//         username: 'Sri Harini',
//         password: '123'
//     },
//     {
//         id: 2,
//         username: 'Sriram',
//         password: '456'
//     }
// ];

// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;

//     for (let user of users) {
//         if (username == user.username && password == user.password) {
//             let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '7d' });
//             res.json({
//                 success: true,
//                 err: null,
//                 token
//             });
//             break;
//         } else {
//             res.status(401).json({
//                 success: false,
//                 token: null,
//                 err: 'Username or password is incorrect'
//             });
//         }
//     }
// });


// app.get('/api/dashboard', jwtMW, (req,res) => {
//     res.json({
//         success: true,
//         myContent: 'Secret content that only logged in people can see!!!'
//     });
// });

// app.get('/', (req, res)=> {
//     res.sendFile(path.join(__dirname, 'index.html'));
// })

// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({
//             success: false,
//             officialError: err,
//             err: 'Username or password is incorrect 2'
//         });
//     } else {
//         next(err);
//     }
// });

// app.listen(PORT, () => {
//     console.log('Serving on port ${PORT}');
// })
