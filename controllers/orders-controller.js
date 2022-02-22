
const mysql = require('../db');

exports.getOrders = async (req, res, next) => {
    try {
        const result = await mysql.execute(`SELECT orders.orderId,
                    orders.quantity,
                    products.productId,
                    products.name,
                    products.price
            FROM orders
        INNER JOIN products
                ON products.productId = orders.productId;`);
        const response = {
            orders: result.map(order => {
                return {
                    orderId: order.orderId,
                    quantity: order.quantity,
                    product: {
                        productId: order.productId,
                        name: order.name,
                        price: order.price,
                    },
                    request: {
                        type: 'GET',
                        description: 'Returns order data!',
                        url: process.env.URL_API + 'orders/' + order.orderId
                    }
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postOrders = async (req, res, next) => {
    try {
        const resultUPdate = await mysql.execute("SELECT * FROM products WHERE productId = ?",
            [req.body.productId]);
        if (resultUPdate.length == 0) {
            return res.status(404).send({ message: 'Product not found!' });
        }
        const result = await mysql.execute("INSERT INTO orders (productId, quantity) VALUES (?,?);",
            [req.body.productId, req.body.quantity]);
        const response = {
            message: 'Order entered successfully!',
            orderCreated: {
                orderId: result.orderId,
                productId: req.body.productId,
                quantity: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Return orders data!',
                    url: process.env.URL_API + 'orders'
                }
            }
        }
        return res.status(201).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneOrder = async (req, res, next) => {

    try {
        const query = 'SELECT * FROM orders WHERE orderId = ?;';
        const result = await mysql.execute( query,
            [req.params.orderId]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'No order found with this ID!'
            })
        }
        const response = {
            order: {
                orderId: result[0].orderId,
                productId: result[0].productId,
                quantity: result[0].quantity,
                request: {
                    type: 'GET',
                    description: 'Return orders data!',
                    url: process.env.URL_API + 'products'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const query = 'DELETE FROM orders WHERE orderId  = ?';
        const result = await mysql.execute( query,
            [req.body.orderId]);
        const response = {
            message: 'Order removed successfully!',
            request: {
                type: 'POST',
                description: 'Insert an order!',
                url: process.env.URL_API + 'orders',
                body: {
                    name: 'String',
                    quantity: 'Number'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};