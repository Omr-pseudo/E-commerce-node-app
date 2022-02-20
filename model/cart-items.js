const Sequelize = require('sequelize');

const sequelize = require('../utilities/database');

const CartItems = sequelize.define('cartItems', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER
    }
});

module.exports = CartItems;