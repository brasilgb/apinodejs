const mysql = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async (req, res, next) => {

    try {
        const resultSelect = await mysql.execute("SELECT * FROM usuarios WHERE email = ?",
            [req.body.email]);
        if (resultSelect.length > 0) {
            res.status(409).send({ mensagem: 'Usuário já cadastrado!' });
        }

        const hash = bcrypt.hashSync(req.body.senha, 10);
        const result = await mysql.execute("INSERT INTO usuarios (email, senha) VALUES (?,?)",
            [req.body.email, hash]);

        const response = {
            mensagem: 'Usuário criado com sucesso!',
            usuarioCriado: {
                id_usuario: result.id_usuario,
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
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        var results = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação' })
        }

        if (await bcrypt.compareSync(req.body.senha, results[0].senha)) {
            const token = jwt.sign({
                id_usuario: results[0].id_usuario,
                email: results[0].email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token
            });
        }
        return res.status(401).send({ message: 'Falha na autenticação' })

    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }
};