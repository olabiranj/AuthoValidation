let Stuff = require('../models/stuff.js');
let User = require('../models/user.js');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
let Post = require('../models/post.js');
let fs = require('fs');

exports.homePage = function (req, res, next) {
    res.render('index', { title: 'Home' });
}
exports.profile = function (req, res, next){
    Post.find({})
    .exec()
    .then(result => {
        res.render('test', { username: req.user.fname, result: result})
    });
}
exports.proPage = function (req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;

    Stuff.find({createdBy: req.user.fname})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, products) {
            Stuff.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('pro', {
                    stuffs: products,
                    current: page,
                    username: req.user.fname,
                    title: "pro",
                    pages: Math.ceil(count / perPage)
                })
            })
        })
}
exports.postStuff = function (req, res, next) {
    let oneStuff = new Stuff;
    oneStuff.name = req.body.name;
    oneStuff.createdBy = req.user.fname;

    oneStuff.save()
        .then((data) => {
            res.redirect('/pro');
        })
        .catch((err) => {
            console.log("Error occured", err);
            req.flash('error', `${err.name}: ${err._message}`)
            res.redirect('/pro');
        });
}
exports.stuffDelete = function (req, res, next) {
    Stuff.findByIdAndRemove({ _id: req.params.id })
        .exec()
        .then(() => {
            res.redirect('/pro');
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
            res.redirect('/pro');
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
                res.redirect('/pro');
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

exports.postPicture = (req, res, next) => {
    const file = req.file
    const ext = file.mimetype.split('/')[1];
    if (!file) {
        req.flash('error', 'upload a photo');
        res.redirect('/profile');
    }
    else {
        let onePost = new Post;
        onePost.pFile = file.path;
        onePost.pUser = req.body.nick;
        onePost.pContent = req.body.content

        onePost.save()
            .then((data) => {
                req.flash('success', 'file successfully uploaded')
                res.redirect('/profile');
            })
            .catch((err) => {
                console.log("Error occured", err);
                req.flash('error', `${err.name}: ${err._message}`)
                res.redirect('/profile');
            });
        console.log(file.path);
    }
}

exports.deletePicture = async (req, res, next) => {
    let oldImage = await Post.findOne({ _id: req.params.id });
    fs.unlink(oldImage.pFile, () => { console.log('image successfully deleted') });

    try {
        await Post.deleteOne({ _id: req.params.id });
        req.flash("success", " record deleted successfully!");
    } catch (err) {
        showError(req, err);
    }
    res.redirect("/profile");

}

exports.updatePost = async(req, res, next) => {
    let result = await Post.findOne({ _id: req.params.id});
    try {
        await res.render('editTest', { result: result, title: 'Edit Post', username: req.user.fname });
    }
    catch(err) {
            console.log(err);
    }
}

exports.updatePostOne = async (req, res, next) => {
    const file = await req.file
    // const ext = file.mimetype.split('/')[1];
    if (!file) {
        await Post.findOneAndUpdate({_id: req.params.id}, {pUser: req.body.newNick, pContent: req.body.newContent})
        res.redirect('/profile')
    }
    else {
        let oldImage = await Post.findOne({ _id: req.params.id });
        await fs.unlink(oldImage.pFile, () => { console.log('image successfully deleted') });
    }
}