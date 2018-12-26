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
router.get('/', controller.homePage);

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

/* GET home page. */
router.get('/welcome', controller.welcomePage);
router.use('/profile', checkLoginStatus);
router.get('/profile', controller.profilePage);
router.post('/profile', controller.postStuff);
router.get('/profile/stuff/edit/:id', controller.stuffEdit);
router.put('/profile/stuff/edit/:id', controller.stuffUpdate);
router.delete('/profile/stuffs/delete/:id', controller.stuffDelete);
router.get('/settings', controller.settings);
router.put('/settings/edit/email', controller.emailUpdate);



module.exports = router;
