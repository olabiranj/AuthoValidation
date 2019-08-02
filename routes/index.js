var express = require('express');
var router = express.Router();
const controller = require('../controller/authoController');
let passport = require("passport");
var multer = require('multer');
let Post = require('../models/post.js');
let Api = require('../models/api.js');
let Order = require('../models/order.js');
let fs = require('fs');


var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
})

// FILE CHECK
function checkFileType(type) {
  return function (req, file, cb) {
    // Allowed ext
    let filetypes;
    if (type == "pdf") {
      filetypes = /pdf/;
    } else if (type == "images") {
      filetypes = /jpeg|jpg|png|gif/;
    }

    // Get ext
    const extname = file.mimetype.split('/')[1];

    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      req.flash('error', 'upload images only')
      cb(new Error(`Error Occured: Upload ${type.toUpperCase()} Only!`));
    }
  };
}

var upload = multer({ storage: storage, fileFilter: checkFileType("images") })



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
  successRedirect: '/pro/1',
  failureRedirect: '/',
  failureFlash: true
}))
router.get('/logout', controller.logout);

/* GET home page. */
router.get('/download', (req, res, next) => {
  res.download('./public/img/5efe.jpg', err =>{
    if (err) {
      console.log(err);
      res.redirect('/')
    } else {
      res.redirect('/');
    }
  });
})
router.get('/welcome', controller.welcomePage);
router.use('/pro', checkLoginStatus);
router.get('/pro/:page', controller.proPage);
router.post('/pro', controller.postStuff);
router.get('/pro/stuff/edit/:id', controller.stuffEdit);
router.put('/pro/stuff/edit/:id', controller.stuffUpdate);
router.delete('/pro/stuffs/delete/:id', controller.stuffDelete);
router.get('/settings', controller.settings);
router.put('/settings/edit/email', controller.emailUpdate);

router.get('/profile', controller.profile);
router.post('/profile', upload.single('avatar'), controller.postPicture);
router.delete('/profile/:id', controller.deletePicture);
router.get('/profile/edit/:id', controller.updatePost);
router.put('/profile/edit/:id', controller.updatePostOne);

router.route('/api')
  .get( async(req, res, next) => {
    Api.find({})
    .sort({date: -1})
    .select('name email order').populate('order')
      .then(result => {
        res.status(200).json({
          message: 'welcome to my api',
          details: result.map( api => {
            return {
              name: api.name,
              email: api.email,
              order: {
                price: api.order.price,
                quantity: api.order.quantity,
                _id: api.order._id
              },
              _id: api._id
              }
          }),
          authour: {
            name: 'mainjoe',
            email: 'my@email.com'
          }
        });
        
      });
    
  })
  .post( async(req, res, next) => {
    let api = new Api({
      name: req.body.name,
      email: req.body.email,
      order: req.body.order
    })
    
    let result = await api.save()
    res.status(200).json({
      message: 'post saved successfully',
      body: result
    })
    console.log(result);
      
  })

router.route('/api/:id')
  .delete((req, res, next) => {
    Api.findOneAndDelete({_id: req.params.id})
    .exec()
    .then(res.status(200).json({
      message: 'Item deleted',
      _id: req.params.id,
      type: {
        url: 'http://localhost:3000/api',
        req: 'DELETE'
      }
    }))
  })

router.route('/order/:id')
  .delete((req, res, next) => {
    Order.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then(res.status(200).json({
        message: 'Item deleted',
        _id: req.params.id,
        type: {
          url: 'http://localhost:3000/order',
          req: 'DELETE'
        }
      }))
  })

router.route('/order')
  .get(async (req, res, next) => {
    Order.find({}).select('price quantity')
      .then(result => {
        res.status(200).json({
          message: 'order api',
          details: result.map(api => {
            return {
              price: api.price,
              quantity: api.quantity,
              _id: api._id
            }
          })
        });

      });

  })
  .post(async (req, res, next) => {
    let order = new Order({
      price: req.body.price,
      quantity: req.body.quantity
    })

    let result = await order.save()
    res.status(200).json({
      message: 'post saved successfully',
      body: result,
      type: {
        url: 'http://localhost:3000/order',
        req: 'GET'
      }
    })
    console.log(result);

  })



module.exports = router;
