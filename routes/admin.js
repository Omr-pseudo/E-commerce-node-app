const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin');



router.get('/add-products', adminController.getAddProducts);

router.get('/products', adminController.getAdminProducts);

router.post('/add-products', adminController.postAddProducts);

router.get('/edit-products/:productId', adminController.getEditProducts);

router.post('/edit-products', adminController.postEditedProducts);

router.post('/delete-products', adminController.postDeleteProduct);




module.exports = router;