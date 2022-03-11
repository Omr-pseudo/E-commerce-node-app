
const {validationResult} = require('express-validator');

const fileDeletion = require('../utilities/file-unlink');


//Product model
const Product = require('../model/product'); 







exports.getAddProducts = (req, res, next) => {
    
    res.render("admin/edit-products", {myTitle:"Add Products", path:"/admin/add-products", editing: false, hasError:null, errorMessage: null});
}

exports.getAdminProducts = (req, res, next) => {

    Product.find({userId: req.user._id})
    .then( rows => {

        res.render('admin/products', { prods: rows,
            myTitle: 'Admin Products', 
             path:"/admin/products"
            });

    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
    
        res.render("admin/edit-products", {
            
        myTitle:"Edit Products", 
        path:"/admin/edit-products",
        editing: edit_mode,
        product:product,
        hasError: false,
        errorMessage: null,

    })
    
}).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}


exports.postAddProducts = (req, res, next) => {

    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    
    if(!image){

        return res.status(422).render("admin/edit-products", 
        
        {myTitle:"Add Products", 
        
        path:"/admin/add-products", 
        
        editing: false, 
        
        hasError:true, 
        
        errorMessage:"Please select a valid image",
        
        product: {
          title: title,
          price: price,
          description: description
        }
    
    });
    }

    const imageURL = image.path;

    const errors = validationResult(req);

    if(!errors.isEmpty()){

        return res.status(422).render("admin/edit-products", 
        
        {myTitle:"Add Products", 
        
        path:"/admin/add-products", 
        
        editing: false, 
        
        hasError:true, 
        
        errorMessage: errors.array()[0].msg,
        
        product: {
          title: title,
          imageURL: imageURL,
          price: price,
          description: description
        }
    
    });
    }

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
        const error = new Error(err);
        error.httpStatusCode = 500;

        return next(error);
    })

    
}



exports.postEditedProducts = (req, res, next) => {

    const id = req.body.id;
    const updatedtitle = req.body.title;
    const updatedimage = req.file;
    const updatedprice = req.body.price;
    const updateddescription = req.body.description;
    
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-products",
     {
            
      Title:"Edit Products", 
      path:"/admin/edit-products",
      editing: true,
      hasError: true,
      product: {
        title: updatedtitle,
        price: updatedprice,
        description: updateddescription,
        _id: id
      },
      errorMessage: errors.array()[0].msg
    });
  }
    
    
    Product.findById(id).then(product => {

        if(!(product.userId.toString() === req.user._id.toString())){

            return res.redirect('/');
        }
        
        
        product.title = updatedtitle;
        product.price = updatedprice;
        product.description = updateddescription;
        if( updatedimage){

            fileDeletion.unlinkOnDelete(product.imageURL);

            product.imageURL = updatedimage.path;
        }
        
         
        return product.save().then( result => {
            console.log("[UPDATED]: PRODUCT");
            res.redirect('/admin/products');
        })
    })
    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });

    

}

exports.postDeleteProduct = (req, res, next) => {

    const product_id = req.body.prod_id;

    Product.findById(product_id)
    .then( product =>{ 

        if(!product){

            return next(new Error("Product does not exist"));
        }

        fileDeletion.unlinkOnDelete(product.imageURL);

        return Product.deleteOne({_id:product_id, userId: req.user._id});
    })
    
    .then( result => {
        res.redirect('/admin/products');
        console.log("[DELETED]: PRODUCT")
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    
}