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
   
    let fetchedCart;

    let newQuantity = 1;

    req.user
    .getCart().then( cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: productID}}); 
    }).then( products => {
        let product;

        
        if(products.length > 0){
            product = products[0];

        }

        if(product){
            const oldQuantity = product.cartItems.quantity;
            newQuantity = oldQuantity + 1;

            return product;
        }

        return product.findByPk(productID);
    })
    .then( data => {
        return fetchedCart.addProduct(product, { through: {quantity: newQuantity}})
    })
    .then( () => {

        res.redirect("/cart");
    })
    .catch( err => {
        console.log(err);
    });

    
}

exports.getCart = (req, res, next) => {

    req.user
    .getCart()
    .then( cart => {
        return cart
        .getProducts()
        .then(products => {
            res.render('shop/cart', 
            {myTitle:"Your Cart", 
            path: "/cart",
            products: products 
        });
        })
        .catch( err => {
            console.log(err);
        });
    });
}


exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {myTitle:"Checkout", path: "/checkout"});
}


exports.getOrders = (req, res, next) => {

    res.render('shop/orders', {myTitle:"Orders", path:"/orders"})
}