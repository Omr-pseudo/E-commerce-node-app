const User = require('../model/user');

exports.getLogin = (req,res,next) => {

    

    res.render('auth/login-form', { 
        myTitle: 'Login', 
         path:"/login",
         isAuthenticated: req.session.isLoggedIn
        });
}

exports.postLogin = (req,res,next) => {

    User.findById('621b9724522142874834b81c')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
}


exports.postLogout = (req,res,next) => {

    req.session.destroy( (err) => {

        console.log(err);

        res.redirect('/');
    })
    
    
}