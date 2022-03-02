const express = require('express');

const router = express.Router();

const shopController = require('../controller/shop');

const isAuth = require('../middleware/is-auth');




router.get('/', shopController.getIndex);

router.get('/products', shopController.getShopProducts);

router.get('/products/:productId', shopController.getProductID);

router.post('/cart', isAuth, shopController.postCart);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart-delete-item', isAuth, shopController.postDeleteFromCart);

router.post('/orders', isAuth, shopController.postOrders);

router.get('/orders', isAuth, shopController.getOrders);




module.exports = router;