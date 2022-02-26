const Product = require('../model/product'); 



exports.getIndex = (req, res, next) => {
    
    Product.find().then( products => {

        res.render('shop/index', { prods: products,
            myTitle: 'Shop', 
             path:"/"
            });

    })
    .catch( err => {
        console.log(err);
    });

}


exports.getShopProducts = (req, res, next) => {

    Product.find()
    .then( products => {
        res.render('shop/product-list', { prods: products,
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

    
    Product.findById(productID).then(product => {
    
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
   
    Product.findById(productID).then( product => {

        return req.user.addToCart(product);

    }).then( result => {
        console.log(result);
        res.redirect('/cart');
        

    }).catch( err => {
        console.log(err);
    });

    
}

exports.getCart = (req, res, next) => {

    req.user
    .getCart()
    .then( products => {
            res.render('shop/cart', 
            {myTitle:"Your Cart", 
            path: "/cart",
            products: products 
        
        })
    })
        .catch( err => {
            console.log(err);
        });
    
}

exports.postDeleteFromCart = (req, res, next) => {
    
    const prod_id = req.body.productId;

    req.user.deleteFromCart(prod_id)

    .then( result => {

        console.log( req.body.productId, "Deleted !!");
        res.redirect("/cart");
    })
    .catch(err => {
        console.log(err);
    })

}



exports.postOrders = (req, res, next) => {

    req.user
    .addOrder().then( result => {

        res.redirect('/orders');
    }).catch( err => {
        console.log(err);
    });
}

exports.getOrders = (req, res, next) => {

    req.user.getOrders()

    .then( orders => {

        res.render('shop/orders',
         {
             myTitle:"Orders", 
             path:"/orders",
             orders: orders
            });
    })
    .catch( err => {
        console.log(err);
    });
}