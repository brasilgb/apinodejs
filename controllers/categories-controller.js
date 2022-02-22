const { connect } = require('../routes/categories');

const mysql = require('../db');

exports.getCategories = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM categories;")
        const response = {
            quantity: result.length,
            categories: result.map(cat => {
                return {
                    categoryId: cat.categoryId,
                    name: cat.name,
                    request: {
                        type: 'GET',
                        description: 'Returns the data of a category!',
                        url: process.env.URL_API + 'categories/' + cat.categoryId
                    }
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postCategory = async (req, res, next) => {
    try {
        const query = 'INSERT INTO categories (name) VALUES (?)';
        const result = await mysql.execute(query, [
            req.body.name
        ]);
        const response = {
            mensagem: 'Category inserted successfully!',
            categoryCreated: {
                categoryId: result.categoryId,
                name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Returns all categories!',
                    url: process.env.URL_API + 'categories'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneCategory = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM categories WHERE categoryId = ? ;", [req.params.categoryId]);
        const response = {
            category: {
                categoryId: result[0].categoryId,
                name: result[0].name,
                request: {
                    type: 'GET',
                    description: 'Returns all categories!',
                    url: process.env.URL_API + 'categories'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const result = await mysql.execute(`UPDATE categories SET name = ? WHERE categoryId  = ?`,
            [
                req.body.name,
                req.body.categoryId
            ])
        const response = {
            mensagem: 'Category successfully updated!',
            category: {
                categoryId: req.body.categoryId,
                name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Returns all categories!',
                    url: process.env.URL_API + 'categories/' + req.body.categoryId
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM categories WHERE categoryId  = ?", [req.body.categoryId]);
        const response = {
            mensagem: 'Category removed successfully!',
            request: {
                type: 'POST',
                description: 'Insert a category!',
                url: process.env.URL_API + 'categories',
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