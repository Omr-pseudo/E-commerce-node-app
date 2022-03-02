const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin');

const isAuth = require('../middleware/is-auth');



router.get('/add-products', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getAdminProducts);

router.post('/add-products', isAuth,adminController.postAddProducts);

router.get('/edit-products/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-products', isAuth, adminController.postEditedProducts);

router.post('/delete-products', isAuth, adminController.postDeleteProduct);




module.exports = router;