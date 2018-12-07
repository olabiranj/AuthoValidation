let Stuff = require('../models/stuff.js');

exports.homePage = function (req, res, next) {
    res.render('index', { title: 'Home' });
}
exports.profilePage = function (req, res, next) {
    Stuff.find({})
        .exec()
        .then((stuffs) => {
            res.render('profile', { title: "Profile", stuffs: stuffs});
        })
        .catch((err) => {
            console.log("Error occured", err);
        });
}
exports.postStuff = function (req, res, next) {
    let oneStuff = new Stuff;
    oneStuff.name = req.body.name;

    oneStuff.save()
        .then((data) => {
            res.redirect('/profile');
        })
        .catch((err) => {
            console.log("Error occured", err);
            req.flash('error', `${err.name}: ${err._message}`)
            res.redirect('/profile');
        });
}
exports.welcomePage = function (req, res, next) {
    res.render('welcomepg', {title: 'Registration Successful'});
}
exports.settings = function (req, res, next) {
    res.render('settings', {title: 'Settings'});
}
exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}