const User = require('../model/user');

const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {

    

    res.render('auth/login-form', { 
        myTitle: 'Login', 
         path:"/login",
         isAuthenticated: req.session.isLoggedIn
        });
}

exports.postLogin = (req,res,next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}).then( user => {

    return bcrypt.compare(password, user.password).then( matched => {

      if(!matched){

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
    .catch(err => console.log(err));
}


exports.postLogout = (req,res,next) => {

    req.session.destroy( (err) => {

        console.log(err);

        res.redirect('/');
    })
    
    
}

exports.getSignup = (req, res, next) => {

  res.render('auth/signup-form', { 
    myTitle: 'Signup', 
     path:"/signup",
     isAuthenticated: req.session.isLoggedIn
    });
  }

exports.postSignup = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirm_password;

  User.findOne({email: email})
  .then( userDoc => {

    if(userDoc) {

      return res.redirect('/signup');
    }

    return bcrypt.hash(password, 12).then( hashedPassword => {

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

  }).catch( err => {

    console.log(err);
  })
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