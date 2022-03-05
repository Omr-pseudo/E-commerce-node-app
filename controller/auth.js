const User = require('../model/user');

const {validationResult} = require('express-validator/check');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const nodemailer = require('nodemailer');

const sendgridTransport = require('nodemailer-sendgrid-transport');

const user = require('../model/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({

    auth: {
      api_key: "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"
    }
  })
);



exports.getLogin = (req,res,next) => {

    let message = req.flash("error");

    if(message.length > 0){

      message = message[0];
    }

    else {

      message = null;
    }


    res.render('auth/login-form', { 
        myTitle: 'Login', 
         path:"/login",
         errorMessage: message

        });
}

exports.postLogin = (req,res,next) => {

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if(!errors.isEmpty()){

    return res.status(422).render('auth/login-form', { 
      myTitle: 'Login', 
       path:"/login",
       errorMessage: errors.array()[0].msg
      });
  }

  User.findOne({email: email}).then( user => {

    if(!user){

      req.flash("error", "Invalid email or password.");

      return res.redirect('/login');
    }

    return bcrypt.compare(password, user.password).then( matched => {

      if(!matched){
        req.flash("error", "Invalid email or password.");
        return res.redirect('/login');
      }


      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });


    }).catch( err => {

      console.log(err);

      res.redirect('/login');
    })
  })

    User.findById('621b9724522142874834b81c')
    .then(user => {
      
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}


exports.postLogout = (req,res,next) => {

    req.session.destroy( (err) => {

        console.log(err);

        res.redirect('/');
    })
    
    
}

exports.getSignup = (req, res, next) => {

  let message = req.flash("error");

  if(message.length > 0){

    message = message[0];
  }

  else{

    message = null;
  }

  res.render('auth/signup-form', { 
    myTitle: 'Signup', 
     path:"/signup",
     errorMessage: message,
     oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    }
    });
  }

exports.postSignup = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  

  const errors = validationResult(req)

  if(!errors.isEmpty()){

    return res.status(422).render('auth/signup-form', 
    { 
       myTitle: 'Signup', 
       path:"/signup",
       errorMessage: errors.array()[0].msg,
       oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirm_password
      }
      });
  }

  bcrypt.hash(password, 12).then( hashedPassword => {

      const newUser = new User(
        {
          email: email,
          password: hashedPassword, 
          cart: {items:[]}
          });

      return newUser.save()

    }).then( result => {

      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getReset = (req, res, next) => {

  let message = req.flash("error");

  if(message.length > 0){

    message = message[0];
  }

  else{

    message = null;
  }

  res.render("auth/reset", {
     myTitle: 'Reset Passowrd', 
     path:"/login",
     errorMessage: message
  })
  
}

exports.postReset = (req, res, next) => {

  crypto.randomBytes(32, (err, buffer) => {

    if(err){

      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    const email = req.body.email;

    User.findOne({email: email}).then( user => {

        if(!user){
          req.flash("error", "User does not exist with this email.");
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();

    }).then( result => {

      req.flash("error","Checkout your Inbox");
      
      //Included this to display the user that email has been sent

      let message = req.flash("error");

    if(message.length > 0){

      message = message[0];
    }

    else {

      message = null;
    }


    res.render('auth/login-form', { 
        myTitle: 'Login', 
         path:"/login",
         errorMessage: message
        });

      //transporter sending email from sendgrid account

      transporter.sendMail({
        to: req.body.email,
        from: 'FA19-BCS-066@isbstudent.comsats.edu.pk',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password.</p>
        `
      });
    })
    
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });


  });
}


exports.getNewPassword = (req,res,next) => {

  const token = req.params.token;

  User.findOne({resetToken:token, resetTokenExpiration: {$gt: Date.now()}})

  .then(
    user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password-form', {
      path: '/login',
      myTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}


exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let reset_user;

    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {$gt: Date.now()},
      _id: userId
    })

    .then( user => {

      reset_user = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then( hashedPassword => {

      reset_user.password = hashedPassword;
      reset_user.resetToken = undefined;
      reset_user.resetTokenExpiration = undefined;
      
      return reset_user.save();
    })
    .then( result => {

      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}


//Setting a cookie


/*

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req
    .get('Cookie')
    .split(';')[1]
    .trim()
    .split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};

*/