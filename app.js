const express = require('express');

const bodyParser = require('body-parser');

const path = require('path')


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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



//-------------------------------------App listening to Port------------------------------------------------------------

app.listen(3000);
