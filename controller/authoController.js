let Stuff = require('../models/stuff.js');
let User = require('../models/user.js');

exports.homePage = function (req, res, next) {
    res.render('index', { title: 'Home' });
}
exports.profilePage = function (req, res, next) {
    Stuff.find({createdBy: req.user.fname})
        .exec()
        .then((stuffs) => {
            res.render('profile', { title: "Profile", stuffs: stuffs, username: req.user.fname});
        })
        .catch((err) => {
            console.log("Error occured", err);
        });
}
exports.postStuff = function (req, res, next) {
    let oneStuff = new Stuff;
    oneStuff.name = req.body.name;
    oneStuff.createdBy = req.user.fname;

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
exports.stuffDelete = function (req, res, next) {
    Stuff.findByIdAndRemove({ _id: req.params.id })
        .exec()
        .then(() => {
            res.redirect('/profile');
        })
        .catch((err) => {
            console.log(err);
        })
}
exports.stuffEdit = function (req, res, next) {
    Stuff.findOne({ _id: req.params.id} )
        .exec()
        .then((stuff) => {
            res.render('edit', { title: 'Edit Stuff', stuff: stuff, username: req.user.fname});
        })
        .catch((err) => {
            console.log(err);
        })
}
exports.stuffUpdate = function (req, res, next) {
    Stuff.findOneAndUpdate({_id: req.params.id}, {name: req.body.name})
        .exec()
        .then(() => {
            res.redirect('/profile');
        })
        .catch((err) => {
            console.log(err);
        })
}
exports.welcomePage = function (req, res, next) {
    res.render('welcomepg', {title: 'Registration Successful'});
}
exports.settings = function (req, res, next) {
    res.render('settings', {title: 'Settings', username: req.user.fname, email: req.user.email, password: req.user.password});
}
exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}

exports.emailUpdate = function (req, res, next) {

    if (req.body.dbEmail == req.user.email ) {
        User.findOneAndUpdate({ _id: req.user._id }, { email: req.body.newEmail })
            .exec()
            .then(() => {
                res.redirect('/profile');
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else{
        req.flash('info', "Incorrect Email!");
        res.redirect('/settings');
    }
}

