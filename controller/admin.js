const Product = require('../model/product'); 

exports.getAddProducts = (req, res, next) => {
    
    res.render("admin/edit-products", {myTitle:"Add Products", path:"/admin/add-products", editing: false});
}

exports.getAdminProducts = (req, res, next) => {

    Product.find()
    .then( rows => {

        res.render('admin/products', { prods: rows,
            myTitle: 'Admin Products', 
             path:"/admin/products"
            });

    })
    .catch( err => {
        console.log(err);
    });

    
}

exports.getEditProducts = (req, res, next) => {
    
    const edit_mode = req.query.edit;

    if(!edit_mode){
        return res.redirect('/');
    }


    const product_id = req.params.productId;

    

    Product.findById(product_id).then(product => {

        if(!product){
            return res.redirect('/');
        }
    
        res.render("admin/edit-products", {myTitle:"Edit Products", 
        path:"/admin/edit-products",
        editing: edit_mode,
        product:product
    }).catch( err => {
        console.log(err);
    });
    
});
}


exports.postAddProducts = (req, res, next) => {

    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageURL: imageURL,
        userId: req.user
    });

    product.save()
    .then( result => {
        res.redirect('/admin/products');
        console.log(" [CREATED]: PRODUCT")
    })
    .catch( err => {
        console.log(err);
    })

    
}



exports.postEditedProducts = (req, res, next) => {

    const id = req.body.id;
    const updatedtitle = req.body.title;
    const updatedimageURL = req.body.imageURL;
    const updatedprice = req.body.price;
    const updateddescription = req.body.description;

    Product.findById(id).then(product => {

        product.title = updatedtitle;
        product.price = updatedprice;
        product.description = updateddescription;
        product.imageURL = updatedimageURL;
         
        return product.save()
    })
    .then( result => {
        console.log("[UPDATED]: PRODUCT");
        res.redirect('/admin/products');
    })
    .catch( err => {
        console.log(err);
    });

    

}

exports.postDeleteProduct = (req, res, next) => {

    const product_id = req.body.prod_id;
    Product.findByIdAndRemove(product_id)
    .then( result => {
        res.redirect('/admin/products');
        console.log("[DELETED]: PRODUCT")
    })
    .catch( err => {
        console.log(err);
    });
    
}