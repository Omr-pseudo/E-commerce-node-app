const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const sequelize = require('./utilities/database');
//------------------------------------------Models----------------------------------------------------------------------

const User = require('./model/user');

const Product = require('./model/product');

const Cart = require('./model/cart');

const CartItems = require('./model/cart-items');

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

    User.findByPk(1).then( user => {
        req.user = user;
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

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});

User.hasMany(Product);

User.hasOne(Cart);

Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItems});

Product.belongsToMany(Cart, {through: CartItems});



sequelize
//.sync({ force: true })
.sync()
.then( result => {
    return User.findByPk(1);
})
.then( user => {
    if(!user){
        return User.create({name:"Omer Ali", email: "test@test.com"});
    }
    return user
})
.then( user => {
    
    return user.createCart();
})
.then( cart => {
    app.listen(3000);
})
.catch( err => {
    console.log(err);
})


