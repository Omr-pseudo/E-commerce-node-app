const Product = require('../model/product'); 

exports.getAddProducts = (req, res, next) => {
    
    res.render("admin/edit-products", {myTitle:"Add Products", path:"/admin/add-products", editing: false});
}

exports.getAdminProducts = (req, res, next) => {

    Product.findAll().then( rows => {

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

    

    Product.findByPk(product_id).then(product => {
    
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


    req.user.createProduct({
        title:title,
        price: price,
        imageUrl: imageURL,
        description:description
    }).then( result => {
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


    Product.findByPk(id)
    .then( product => {
        product.title = updatedtitle;
        product.imageUrl = updatedimageURL;
        product.price = updatedprice;
        product.description = updateddescription;

        return product.save();
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
    Product.findByPk(product_id).then( product => {
        return product.destroy();
    })
    .then( result => {
        res.redirect('/admin/products');
        console.log("[DELETED]: PRODUCT")
    })
    .catch( err => {
        console.log(err);
    });
    
}