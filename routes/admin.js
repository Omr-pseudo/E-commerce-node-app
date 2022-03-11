const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin');

const isAuth = require('../middleware/is-auth');

const {body} = require('express-validator/check');



router.get('/add-products', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getAdminProducts);

router.post('/add-products',
[
    body('title')
    .isString()
    .withMessage("A title should be atleast 4 characters long.")
    .isLength({min:4})
    .trim(),
    body('price')
    .isFloat()
    .withMessage("Please enter a valid price")
    ,
    body('description')
    .isString()
    .isLength({min: 10, max: 400})
    .withMessage("Description should be between the range of 10 to 200 characters.")

] ,isAuth,adminController.postAddProducts);

router.get('/edit-products/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-products',

[
    body('title')
    .isString()
    .isLength({min:4})
    .trim()
    .withMessage("A title should be atleast 4 characters long.")
    ,
    body('price')
    .isFloat()
    .withMessage("Please enter a valid price")
    ,
    body('description')
    .isString()
    .isLength({min:10, max:400})
    .withMessage("Description should be between the range of 10 to 200 characters.")

] 
,isAuth, adminController.postEditedProducts);

router.post('/delete-products', isAuth, adminController.postDeleteProduct);




module.exports = router;