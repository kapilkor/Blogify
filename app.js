require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const ejs = require('ejs');
const mongoose = require('./connect.js');
const cookieParser = require('cookie-parser');
const { checkForAuthentication } = require('./middleware/authentication.js');
const multer = require('multer');
const BLOG = require('./Model/Blog.js');

const userRoutes = require('./Routes/user.js');
const blogRoutes = require('./Routes/Blog.js');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));  // file handling
app.use(express.json());
app.use(checkForAuthentication("token"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB database");
});



app.get('/', async (req, res) => {
    try {
        const allBlog = await BLOG.find({})
            .populate('createdBy', 'fullname')
            .sort({ createdAt: -1 });
        res.render('home', {
            user: req.user,
            blogs: allBlog
        });
    } catch (err) {
        console.error('Error loading home page:', err);
        res.status(500).send('Error loading page');
    }
})

app.use('/user', userRoutes);

app.use('/blog', blogRoutes);

// Multer error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.render('AddBlog', { 
                user: req.user, 
                err: 'File size too large! Maximum size is 5MB.' 
            });
        }
    } else if (err) {
        if (err.message.includes('Only image files')) {
            return res.render('AddBlog', { 
                user: req.user, 
                err: 'Only image files (jpg, jpeg, png, gif, webp) are allowed!' 
            });
        }
    }
    next(err);
});

// 404 Handler - Must be after all other routes
app.use((req, res) => {
    res.status(404).render('404', { user: req.user });
});

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
})