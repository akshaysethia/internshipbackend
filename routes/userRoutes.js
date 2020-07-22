const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user.model');

router.get('/register', (req, res) => {
    res.json({ page: 'Register Page !' });
});

router.post('/register', (req, res) => {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        admin: req.body.admin,
        category: req.body.category
    });

    User.findOne({ email: user.email })
        .then((found) => {
            if (found) {
                res.json({ success: false, message: 'User already Exists !' });
            } else {
                bcrypt.genSalt(10)
                    .then((salt) => {
                        bcrypt.hash(req.body.password, salt)
                            .then((hash) => {
                                user.password = hash;
                                User.create(user)
                                    .then((newUser) => {
                                        if (newUser) {
                                            res.json({ success: true, message: 'User Created !' });
                                        } else {
                                            res.json({ success: false, message: 'User could not be Created !' });
                                        }
                                    })
                                    .catch((err) => console.log('An Error Occured: ', err));
                            })
                            .catch((err) => console.log('An Error Occured: ', err));
                    })
                    .catch((err) => console.log('An Error Occured: ', err));
            }
        })
        .catch((err) => console.log('An Error Occured: ', err));
});

router.get('/login', (req, res) => {
    res.json({ page: 'Login Page !' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            console.log('An Error Occured: ', err);
        } else if (!user) {
            res.json({ success: false, message: 'User Does not Exist !' });
        } else {
            bcrypt.compare(password, user.password)
                .then((retUser) => {
                    if (!retUser) {
                        res.json({ success: false, message: 'Incorrect Password !' });
                    } else {
                        const tokenuser = { _id: user._id, name: user.name, email: user.email };
                        const token = jwt.sign(tokenuser, process.env.SECRET, { expiresIn: 36000000 });

                        res.json({ success: true, token: 'JWT ' + token, user: {
                            name: user.name,
                            email: user.email,
                            admin: user.admin,
                            category: user.category
                        }});
                    }
                })
                .catch((err) => console.log('An Error Occured: ', err));
        }
    });
});

router.get('/checkToken', (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            console.log('An Error Occured: ', err);
        } else if (!user) {
            res.json({ success: false, message: 'Invalid JWT !', user: false });
        } else {
            res.json({ success: true, message: "Valid JWT !", user: { name: user.name, email: user.email, admin: user.admin, category: user.category } });
        }
    })(req, res);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: { name: req.user.name, email: req.user.email, admin: req.user.admin, category: req.user.category } });
});

module.exports = router;