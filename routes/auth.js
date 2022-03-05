const express = require('express');

const router = express.Router();

const authController = require('../controller/auth');

const {check, body} = require('express-validator/check');

const User = require('../model/user');



router.get('/login', authController.getLogin);




router.post('/login',

      body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')

      ,authController.postLogin);


router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);


//Validating sign up inputs


router.post('/signup',
[
    check('email')
    .isEmail()
    .withMessage("Please Enter is a valid email")
    
    .custom((value,{req}) => {

        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });

    })

    .normalizeEmail()
    ,
    
    body('password', 'Please enter a password of minimum 5 characters and containing only alphabets and numbers')
    .isLength({min:6})
    .isAlphanumeric()
    .trim()
    ,

    body('confirm_password')
    .trim()
    .custom((value, {req}) => {

        if(value!==req.body.password){

            throw new Error("Passwords do not match !");
        }

        return true;
    })
]
, authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);




module.exports = router;