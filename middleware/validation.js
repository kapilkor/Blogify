// Validation helper functions

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
}

function validateBlogInput(req, res, next) {
    const { title, content } = req.body;

    if (!title || title.trim().length === 0) {
        return res.render('AddBlog', {
            user: req.user,
            err: 'Title is required'
        });
    }

    if (!content || content.trim().length === 0) {
        return res.render('AddBlog', {
            user: req.user,
            err: 'Content is required'
        });
    }

    if (title.length > 200) {
        return res.render('AddBlog', {
            user: req.user,
            err: 'Title must be less than 200 characters'
        });
    }

    if (!req.file) {
        return res.render('AddBlog', {
            user: req.user,
            err: 'Cover image is required'
        });
    }

    next();
}

function validateUserSignup(req, res, next) {
    const { fullname, email, password, gender } = req.body;

    if (!fullname || fullname.trim().length === 0) {
        return res.render('signup', { 
            user: req.user, 
            err: 'Full name is required' 
        });
    }

    if (!email || !validateEmail(email)) {
        return res.render('signup', { 
            user: req.user, 
            err: 'Valid email is required' 
        });
    }

    if (!validatePassword(password)) {
        return res.render('signup', { 
            user: req.user, 
            err: 'Password must be at least 6 characters' 
        });
    }

    if (!gender || !['male', 'female'].includes(gender)) {
        return res.render('signup', { 
            user: req.user, 
            err: 'Please select a valid gender' 
        });
    }

    next();
}

function validateComment(req, res, next) {
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
        return res.redirect(`/blog/${req.params.id}#comments-error`);
    }

    if (comment.length > 1000) {
        return res.redirect(`/blog/${req.params.id}#comments-error`);
    }

    next();
}

module.exports = {
    validateBlogInput,
    validateUserSignup,
    validateComment
};
