const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const {mongodbConnection} = require('./utilities/database');

const User = require('./model/user');

//-------------------------------------------Routes---------------------------------------------------------------------

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');
//--------------------------------------Controllers---------------------------------------------------------------------

const errorController = require('./controller/error');

//--------------------------------------Initializing App----------------------------------------------------------------

const app = express();


//--------------------------------------Setting up Pug-------------------------------------------------------------------

app.set('view engine', 'pug');

app.set('views', 'views');

//---------------------------------------Setting Routes-----------------------------------------------------------------

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));


app.use((req,res,next) => {

    User.findById('6216288638ca06c62d717c4f').then( user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch( err => {
        console.log(err);
    });
    
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



//-------------------------------------App listening to Port------------------------------------------------------------


mongodbConnection( () => {

    app.listen(3000);
})


