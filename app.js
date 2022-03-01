const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const mongoose = require('mongoose');

const User = require('./model/user');

const session = require('express-session');

const mongoDB_sessionStore = require('connect-mongodb-session')(session);

//-------------------------------------------Routes---------------------------------------------------------------------

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');
//--------------------------------------Controllers---------------------------------------------------------------------

const errorController = require('./controller/error');

//--------------------------------------Initializing App----------------------------------------------------------------

const app = express();


//--------------------------------------Setting up Pug-------------------------------------------------------------------

app.set('view engine', 'pug');

app.set('views', 'views');

//--------------------------------------Setting up mongoDB session store------------------------------------------------

const MongoDB_URI = 'mongodb+srv://<username>:<password>@cluster0.t0nch.mongodb.net/<database>?';

const store = new mongoDB_sessionStore({
    uri: MongoDB_URI,
    collection: "sessions"
})

//--------------------------------------Setting up session--------------------------------------------------------------

app.use(

    session(
        {
            secret:"my secret key",
            resave: false,
            saveUninitialized: false,
            store:store
          }
        )
    );

//---------------------------------------Setting Routes-----------------------------------------------------------------

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));


app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);



//-------------------------------------App listening to Port------------------------------------------------------------

mongoose.connect(MongoDB_URI).then( result => {
    
   
    User.findOne().then( user => {
        if(!user){
            const user = new User({

                name: 'Omer',
                email: 'test@test.com',
                cart :{
                    items: []
                }
            });

            user.save();

        }

        app.listen(3000);
    })
})
.catch( err => {
    console.log(err);
})


