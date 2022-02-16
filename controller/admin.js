const Product = require('../model/product'); 

exports.getAddProducts = (req, res, next) => {
    
    res.render("admin/edit-products", {myTitle:"Add Products", path:"/admin/add-products", editing: false});
}

exports.getAdminProducts = (req, res, next) => {

    Product.fetchAll( products => {

        res.render('admin/products', { prods: products,
        myTitle: 'Admin Products', 
         path:"/admin/products"
        });
        
    });
}

exports.getEditProducts = (req, res, next) => {
    
    const edit_mode = req.query.edit;

    if(!edit_mode){
        return res.redirect('/');
    }


    const product_id = req.params.productId;

    

    Product.findById(product_id, product => {
    
        res.render("admin/edit-products", {myTitle:"Edit Products", 
        path:"/admin/edit-products",
        editing: edit_mode,
        product:product
    });
    
});
}


exports.postAddProducts = (req, res, next) => {

    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;


    const product = new Product(null, title, imageURL, description, price);

    product.save();

    res.redirect('/');
}



exports.postEditedProducts = (req, res, next) => {

    const id = req.body.id;
    const updatedtitle = req.body.title;
    const updatedimageURL = req.body.imageURL;
    const updatedprice = req.body.price;
    const updateddescription = req.body.description;


    const updatedproduct = new Product(id, updatedtitle, updatedimageURL , updateddescription, updatedprice);

    updatedproduct.save();

    res.redirect('/admin/products');

}

exports.postDeleteProduct = (req, res, next) => {

    const product_id = req.body.prod_id;
    Product.deleteById(product_id);
    res.redirect('/admin/products');
}