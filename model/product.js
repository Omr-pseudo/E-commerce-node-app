const {getdbClient} = require('../utilities/database');

const mongodb = require('mongodb');


class Product {

  constructor(title, price, imageURL, description, id, userId){

    this.title = title,
    this.price = price,
    this.imageURL = imageURL,
    this.description = description
    this._id = id? new mongodb.ObjectId(id): null;
    this.userId = userId;
  }

  save(){

    const db = getdbClient();
    let dbOp;

    if(this._id){

      //updating 

      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});

    }

    else{

      //insert new

      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
    .then( result => {
      console.log(result);
    })
    
    .catch( err => {
      console.log(err);
    });
  }

  static fetchAll(){

    const db = getdbClient();

    return db.collection('products').find().toArray()
    .then( products => {
      console.log("FETCHED !!!");
      return products;
    })
    .catch( err => {
      console.log(err);
    });
  }

  static findById(prod_id){

    const db = getdbClient();

    return db.collection('products').find({ _id: new mongodb.ObjectId(prod_id)})
    .next()

    .then( product => {
      console.log(product);
      return product;
    })

    .catch( err => {
      console.log(err);
    });
  }

  static deleteById(prod_id){

    const db = getdbClient();

    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prod_id)})

    .then( result => { 

      console.log("Deleted !!");
    })

    .catch( err => {
      console.log(err);
    })
  }
}

module.exports = Product;