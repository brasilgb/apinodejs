const mysql = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {

    try {
        const resultselect = await mysql.execute("SELECT * FROM users WHERE email = ?",
            [req.body.email]);
        if (resultselect.length > 0) {
            return res.status(409).send({ message: 'User already registered!' });
        }

        const hash = bcrypt.hashSync(req.body.password, 10);
        const result = await mysql.execute("INSERT INTO users (email, password) VALUES (?,?)",
            [req.body.email, hash]);

        const response = {
            message: 'User registered successfully !',
            userCreated: {
                userId: result.userId,
                email: req.body.email
            }
        }
        return res.status(201).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.Login = async (req, res, next) => {
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        var results = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ message: 'Authentication failed!' })
        }

        if (await bcrypt.compareSync(req.body.password, results[0].password)) {
            const token = jwt.sign({
                userId: results[0].userId,
                email: results[0].email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
            return res.status(200).send({
                message: 'Successfully authenticated!',
                token: token
            });
        }
        return res.status(401).send({ message: 'Authentication failed!' })

    } catch (error) {
        return res.status(500).send({ message: 'Authentication failed!' });
    }
};