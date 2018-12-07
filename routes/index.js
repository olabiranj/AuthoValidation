var express = require('express');
var router = express.Router();
const controller = require('../controller/authoController')
let passport = require("passport");


function checkLoginStatus(req, res, next) {
  if (req.isAuthenticated()) {
    username = req.user.email;
    return next();
  }

  req.flash('error', 'Login to continue');
  res.redirect('/');
}

/* GET home page. */
router.get('/', controller.homePage);
router.get('/profile', controller.profilePage);
router.use('/profile', checkLoginStatus);
router.post('/profile', controller.postStuff);
router.get('/welcome', controller.welcomePage);
router.get('/settings', controller.settings);

router.post('/signup/user', passport.authenticate('local.registerUser', {
  successRedirect: '/welcome',
  failureRedirect: '/',
  failureFlash: true
}))
router.post('/login/user', passport.authenticate('local.loginUser', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}))
router.get('/logout', controller.logout);


module.exports = router;
