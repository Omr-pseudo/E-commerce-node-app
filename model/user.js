const getDb = require('../utilities/database').getdbClient;

const mongodb = require('mongodb');

class User {

    constructor(user, email,cart,id){

        this.user = user;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();

        return db.collection('users').insertOne(this);
    }

    static findById(userId){

        const db = getDb();

        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }

    addToCart(product){


        const existingCartProductIndex = this.cart.items.findIndex( cart_product => {
            return cart_product.productId.toString() === product._id.toString(); 
        })

        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items];

        if( existingCartProductIndex >= 0){

            newQuantity = this.cart.items[existingCartProductIndex].quantity + 1;
            updatedCartItems[existingCartProductIndex].quantity = newQuantity;
        }

        else{

            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id), 
                quantity: 1
            });
        }



        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();

        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)}, 
            {$set: {cart: updatedCart}}
            );
    }

    deleteFromCart(productId){

        const updatedCartItems = this.cart.items.filter( cart_products => {
            return cart_products.productId.toString() !== productId.toString();
        })

        const db = getDb();

        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, 
            { $set: {cart: {items: updatedCartItems}}});
    }

    getCart(){

        const db = getDb();

        const productIds = this.cart.items.map( p => {
            return p.productId;
        });

        return db.collection('products')
        .find({_id : {$in: productIds}})
        .toArray()
        .then( products => {

         return   products.map( p => {

                return {
                    ...p,
                    quantity: this.cart.items.find( item => {
                        return item.productId.toString() === p._id.toString();
                    }).quantity
                };
            });
        });
    }
}

module.exports = User;