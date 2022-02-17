const Product = require('../model/product'); 
const Cart = require('../model/cart');


exports.getIndex = (req, res, next) => {
    
    Product.findAll().then( rows => {

        res.render('shop/index', { prods: rows,
            myTitle: 'Shop', 
             path:"/"
            });

    })
    .catch( err => {
        console.log(err);
    });

}


exports.getShopProducts = (req, res, next) => {

    Product.findAll()
    .then( rows => {
        res.render('shop/product-list', { prods: rows,
            myTitle: 'Products', 
             path:"/products"
            });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.getProductID = (req, res, next) => {

    const productID = req.params.productId;

    
    Product.findByPk(productID).then(product => {
    
        res.render('shop/product-detail', {
            product: product,
            myTitle: product.title,
            path: "/products"
    }).catch( err => {
        console.log(err);
    });
    
});
    
}


exports.postCart = (req, res, next) => {

    const productID = req.body.productID;
    

    Product.findById(productID, product => {
        Cart.addProduct(productID, product.price);
    });

    res.redirect("/cart");
}

exports.getCart = (req, res, next) => {

    res.render('shop/cart', {myTitle:"Your Cart", path: "/cart"});
}


exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {myTitle:"Checkout", path: "/checkout"});
}


exports.getOrders = (req, res, next) => {

    res.render('shop/orders', {myTitle:"Orders", path:"/orders"})
}