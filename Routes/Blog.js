const express = require('express');
const router = express.Router();
const BLOG = require('../Model/Blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const COMMENT = require('../Model/comment');
const USER = require('../Model/user');
const { validateBlogInput, validateComment } = require('../middleware/validation');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = `./public/uploads/${req.user._id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;

        const isMimeValid = allowedTypes.test(file.mimetype);
        const isExtValid = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (isMimeValid && isExtValid) {
            return cb(null, true);
        }

        cb(
            new Error("Only image files (jpg, jpeg, png, gif, webp) are allowed!"),
            false
        );
    }
})

router.get('/add', requireAuth, (req, res) => {
    res.render("AddBlog", { user: req.user, err: null });
})

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const fullUser = await USER.findById(req.user._id);
        const userBlogs = await BLOG.find({ createdBy: req.user._id }).populate('createdBy', 'fullname');
        const userComments = await COMMENT.find({ createdBy: req.user._id });
        res.render('Profile', { user: fullUser, blogs: userBlogs, comments: userComments });
    } catch (err) {
        console.error('Error loading profile:', err);
        res.status(500).send('Error loading profile');
    }
});

router.post('/', requireAuth, upload.single('coverImage'), validateBlogInput, async (req, res) => {
    try {
        const { title, content } = req.body;
        const coverImagePath = `/uploads/${req.user._id}/${req.file.filename}`;
    
        const newBlog = await BLOG.create({
            title,
            content,
            coverImage: coverImagePath,
            createdBy: req.user._id
        });
        res.redirect(`/blog/${newBlog._id}`);
    } catch (err) {
        console.error('Error creating blog:', err);
        res.render('AddBlog', { user: req.user, err: 'Error creating blog. Please try again.' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const blogByUser = await BLOG.findById(req.params.id).populate('createdBy', 'fullname');

        if (!blogByUser) {
            return res.status(404).send('Blog not found');
        }

        const comments = await COMMENT.find({ blog_id: req.params.id }).populate('createdBy', 'fullname profileImage gender').sort({ createdAt: -1 });
        return res.render('showBlog', { blog: blogByUser, user: req.user, comments });
    } catch (err) {
        console.error('Error loading blog:', err);
        res.status(500).send('Error loading blog');
    }
});


// COMMENT ROUTES WILL BE HERE 

router.post('/:id/comment', requireAuth, validateComment, async (req, res) => {
    try {
        const commentContent = await COMMENT.create({
            content: req.body.comment,
            createdBy: req.user._id,
            blog_id: req.params.id
        });
        return res.redirect(`/blog/${req.params.id}`);
    } catch (err) {
        console.error('Error creating comment:', err);
        return res.redirect(`/blog/${req.params.id}`);
    }
})

module.exports = router;