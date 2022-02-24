const express = require('express');

const router = express.Router();

const shopController = require('../controller/shop');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getShopProducts);

router.get('/products/:productId', shopController.getProductID);

router.post('/cart', shopController.postCart);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postDeleteFromCart);

router.post('/orders', shopController.postOrders);

router.get('/orders', shopController.getOrders);




module.exports = router;