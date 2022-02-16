const path = require('path');
const fs = require('fs');

const pathofCart = path.join(path.dirname(process.mainModule.filename), "data", "cart.json");


module.exports = class Cart {

    static addProduct = (id, productPrice) => {

        //Fetching previous products

        fs.readFile(pathofCart, (err,fileContent) => {


            let cart = {products:[], totalPrice:0};

            if(!err) {

                cart = JSON.parse(fileContent);
            }

            //Analyze the previous products

            const existingProductIndex = cart.products.findIndex( p => p.id === id );

            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;

            //Add new product, increase the quantity

            if(existingProduct){

                updatedProduct = {...existingProduct};

                updatedProduct.qty = updatedProduct.qty + 1;
                
                cart.products = [...cart.products];

                cart.products[existingProductIndex] = updatedProduct;
            }

            else{

                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(pathofCart, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteFromCart = (id,price) => {

        fs.readFile(pathofCart, (err, fileContent) => {

            if(err){
                return;
            }

            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find( prod => prod.id === id);

            if(!product){
                return;
            }
            const product_quantity = product.qty;

            updatedCart.products = updatedCart.products.filter(
                p => p.id !== id
            );

            updatedCart.totalPrice = updatedCart.totalPrice - price*product_quantity;

            fs.writeFile(pathofCart, JSON.stringify(updatedCart), err => console.log(err));
        });

    }

    static getCartItems(cb){

        fs.readFile(pathofCart, (err, fileContent) => {

            const cart = JSON.parse(fileContent);

            if(err) {
                cb(null);
            }

            else{

                cb(cart);
            }
        });
    }
}