const express = require('express');
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
const {register, logout} = require('../controllers/users')

router.get('/register', (req, res) => {
    res.render('users/register.ejs')
})

router.post('/register', catchAsync(register))

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect('/campgrounds');
})

router.get('/logout', (logout))


module.exports = router