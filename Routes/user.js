const express = require('express');
const router = express.Router();
const USER = require('../Model/user');
const { validateUserSignup } = require('../middleware/validation');


router.get('/signin', (req, res) => {
    res.render("signin", { user: req.user, err: null });
})

router.get('/signup', (req, res) => {
    res.render("signup", { user: req.user, err: null });
})

router.post('/signup', validateUserSignup, async (req, res) => {
    const { fullname, email, password, gender } = req.body;
    try {
        await USER.create({ fullname, email, password, gender });
        return res.redirect('/');
    } catch (err) {
        if (err.code === 11000) {
            return res.render('signup', { user: req.user, err: 'Email already exists! Please use a different email or sign in.' });
        }
        return res.render('signup', { user: req.user, err: 'An error occurred during signup. Please try again.' });
    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await USER.ismatchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect('/');
    } catch (err) {
        let errorMessage = "Invalid email or password";
        
        if (err.message === "User not found") {
            errorMessage = "No account found with this email. Please sign up first.";
        } else if (err.message === "Invalid password") {
            errorMessage = "Incorrect password. Please try again.";
        }
        
        res.render('signin', { user: req.user, err: errorMessage });
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/');
})

// GET Edit Profile Page
router.get('/profile/edit', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    try {
        const fullUser = await USER.findById(req.user._id);
        res.render('EditProfile', { user: fullUser, err: null });
    } catch (err) {
        console.error('Error loading edit profile page:', err);
        res.status(500).send('Error loading page');
    }
})

// POST Edit Profile
router.post('/profile/edit', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    const { fullname, gender, currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await USER.findById(req.user._id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Validate fullname
        if (!fullname || fullname.trim().length === 0) {
            return res.render('EditProfile', { user, err: 'Full name is required' });
        }

        // Update basic info
        user.fullname = fullname.trim();
        user.gender = gender;

        // Handle password change if provided
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.render('EditProfile', { user, err: 'Please fill all password fields to change password' });
            }

            // Verify current password
            const { createHmac } = require('crypto');
            const hashedCurrentPassword = createHmac("sha256", user.salt)
                .update(currentPassword)
                .digest("hex");

            if (hashedCurrentPassword !== user.password) {
                return res.render('EditProfile', { user, err: 'Current password is incorrect' });
            }

            // Validate new password
            if (newPassword.length < 6) {
                return res.render('EditProfile', { user, err: 'New password must be at least 6 characters' });
            }

            if (newPassword !== confirmPassword) {
                return res.render('EditProfile', { user, err: 'New passwords do not match' });
            }

            // Update password (pre-save hook will hash it)
            user.password = newPassword;
        }

        await user.save();
        res.redirect('/blog/profile');
    } catch (err) {
        console.error('Error updating profile:', err);
        const user = await USER.findById(req.user._id);
        res.render('EditProfile', { user, err: 'Error updating profile. Please try again.' });
    }
})

// GET Public User Profile (must be after /profile/edit to avoid conflict)
router.get('/profile/:id', async (req, res) => {
    try {
        const BLOG = require('../Model/Blog');
        const COMMENT = require('../Model/comment');
        
        const profileUser = await USER.findById(req.params.id);
        
        if (!profileUser) {
            return res.status(404).render('404', { user: req.user });
        }
        
        const userBlogs = await BLOG.find({ createdBy: req.params.id }).populate('createdBy', 'fullname');
        const userComments = await COMMENT.find({ createdBy: req.params.id });
        
        res.render('Profile', { 
            user: profileUser, 
            blogs: userBlogs, 
            comments: userComments,
            currentUser: req.user // Pass logged-in user to check if viewing own profile
        });
    } catch (err) {
        console.error('Error loading user profile:', err);
        res.status(500).send('Error loading profile');
    }
})



module.exports = router;