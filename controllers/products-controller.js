const { connect } = require('../routes/products');

const mysql = require('../db');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM products;")
        const response = {
            quantity: result.length,
            products: result.map(prod => {
                return {
                    productId: prod.productId,
                    name: prod.name,
                    price: prod.price,
                    productImage: prod.productImage,
                    request: {
                        type: 'GET',
                        description: 'Returns the data of a product!',
                        url: process.env.URL_API + 'products/' + prod.productId
                    }
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postProduct = async (req, res, next) => {
    try {
        const originalPath = req.file.path;
        const imgPath = originalPath.replace('\\', '/');
        const query = 'INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.name, 
            req.body.price, 
            imgPath,
            req.body.categoryId
        ]);
        const response = {
            mensagem: 'Product inserted successfully!',
            productCreated: {
                productId: result.productId,
                name: req.body.name,
                price: req.body.price,
                productImage: imgPath,
                categoryId: req.body.categoryId,
                request: {
                    type: 'GET',
                    description: 'Returns all products!',
                    url: process.env.URL_API + 'products'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneProduct = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM products WHERE productId = ? ;", [req.params.productId]);
        const response = {
            product: {
                productId: result[0].productId,
                name: result[0].name,
                price: result[0].price,
                request: {
                    type: 'GET',
                    description: 'Returns all products!',
                    url: process.env.URL_API + 'products'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const result = await mysql.execute(`UPDATE products 
            SET name          = ?, 
                price         = ? 
            WHERE productId  = ?`,
            [
                req.body.name,
                req.body.price,
                req.body.productId
            ])
        const response = {
            mensagem: 'Produto atualisado com sucesso!',
            product: {
                productId: req.body.productId,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'GET',
                    description: 'Returns all products!',
                    url: process.env.URL_API + 'products/' + req.body.productId
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM products WHERE productId  = ?", [req.body.productId]);
        const response = {
            mensagem: 'Product removed successfully!',
            request: {
                type: 'POST',
                description: 'Insert a product!',
                url: process.env.URL_API + 'products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postImage = async (req, res, next) => {
    try {
        const originalPath = req.file.path;
        const imgPath = originalPath.replace('\\', '/');
        const query = 'INSERT INTO productimages (productId, path) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.params.productId,
            imgPath
        ]);
        const response = {
            mensagem: 'Image successfully inserted!',
            imageCriada: {
                productId: req.params.productId,
                imageId: result.insertId,
                path: process.env.URL_API + imgPath,
                request: {
                    type: 'GET',
                    description: 'Returns all images!',
                    url: process.env.URL_API + 'products/' + req.params.productId + '/images' 
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getImages = async (req, res, next) => {
    try {
        const query = "SELECT * FROM productimages WHERE productId = ?;";
        const result = await mysql.execute(query, [req.params.productId]);
        const response = {
            quantity: result.length,
            images: result.map(img => {
                return {
                    productId: req.params.productId,
                    imageId: img.imageId,
                    path: process.env.URL_API + img.path,
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
