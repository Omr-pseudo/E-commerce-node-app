const Product = require('../model/product'); 

const Order = require('../model/order');

const MAX_ITEMS_PER_PAGE = 2

exports.getIndex = (req, res, next) => {
    
    const page = +req.query.page || 1;

    let totalItems;

    Product.find().countDocuments().then( totalProducts => {

        totalItems = totalProducts;

        return Product.find()
        .skip((page - 1) * MAX_ITEMS_PER_PAGE)
        .limit(MAX_ITEMS_PER_PAGE)
    })
    .then( products => {

        res.render('shop/index', { prods: products,
            myTitle: 'Shop', 
             path:"/",
             page: page,
             hasNextPage: MAX_ITEMS_PER_PAGE * page < totalItems,
             hasPreviousPage: page > 1,
             nextPage: page + 1,
             previousPage: page - 1,
             lastPage: Math.ceil(totalItems / MAX_ITEMS_PER_PAGE)

            });

    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });

}


exports.getShopProducts = (req, res, next) => {

    const page = +req.query.page || 1;

    let totalItems;

    Product.find().countDocuments().then( totalProducts => {

        totalItems = totalProducts;

        return Product.find()
        .skip((page - 1) * MAX_ITEMS_PER_PAGE)
        .limit(MAX_ITEMS_PER_PAGE)
    })
    .then( products => {
        res.render('shop/product-list', { prods: products,
            myTitle: 'Products', 
             path:"/products",
             page: page,
             hasNextPage: MAX_ITEMS_PER_PAGE * page < totalItems,
             hasPreviousPage: page > 1,
             nextPage: page + 1,
             previousPage: page - 1,
             lastPage: Math.ceil(totalItems / MAX_ITEMS_PER_PAGE)
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });

}

exports.getProductID = (req, res, next) => {

    const productID = req.params.productId;

    
    Product.findById(productID).then(product => {
    
        res.render('shop/product-detail', {
            product: product,
            myTitle: product.title,
            path: "/products"
    })
    
}).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
    
}


exports.postCart = (req, res, next) => {

    const productID = req.body.productID;
   
    Product.findById(productID).then( product => {

        return req.user.addToCart(product);

    }).then( result => {
        console.log(result);
        res.redirect('/cart');
        

    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    
}

exports.getCart = (req, res, next) => {

    req.user
    .populate('cart.items.productId')
    
    .then( user => {

            const products = user.cart.items
            res.render('shop/cart', 
            {myTitle:"Your Cart", 
            path: "/cart",
            products: products
        
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    
}

exports.postDeleteFromCart = (req, res, next) => {
    
    const prod_id = req.body.productId;

    req.user.removeFromCart(prod_id)

    .then( result => {

        console.log( req.body.productId, "Deleted !!");
        res.redirect("/cart");
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });

}



exports.postOrders = (req, res, next) => {

    

    req.user.populate('cart.items.productId')
    
    .then( user => {
        
        console.log(user);
        const products = user.cart.items.map( i => {
            
            return {quantity: i.quantity, product: {...i.productId}};
        });

   

        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },

            products: products
        });


        return order.save();
    }).then( result => {
       
        return req.user.emptyCart();
    })
    .then( () => {
        
        res.redirect('/orders');
    })
    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}

exports.getOrders = (req, res, next) => {

    Order.find({'user.userId': req.user._id})

    .then( orders => {

        res.render('shop/orders',
         {
             myTitle:"Orders", 
             path:"/orders",
             orders: orders
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}