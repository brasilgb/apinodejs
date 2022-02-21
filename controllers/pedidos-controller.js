
const mysql = require('../db');

exports.getPedidos = async (req, res, next) => {
    try {
        const result = await mysql.execute(`SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome,
                    produtos.preco
            FROM pedidos
        INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`);
        const response = {
            pedidos: result.map(pedido => {
                return {
                    id_pedido: pedido.id_pedido,
                    quantidade: pedido.quantidade,
                    produto: {
                        id_produto: pedido.id_produto,
                        nome: pedido.nome,
                        preco: pedido.preco,
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os dados de um pedido!',
                        url: process.env.URL_API + 'pedidos/' + pedido.id_pedido
                    }
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postPedidos = async (req, res, next) => {
    try {
        const resultUPdate = await mysql.execute("SELECT * FROM produtos WHERE id_produto = ?",
            [req.body.id_produto]);
        if (resultUPdate.length == 0) {
            return res.status(404).send({ message: 'Produto não encontrado' });
        }
        const result = await mysql.execute("INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);",
            [req.body.id_produto, req.body.quantidade]);
        const response = {
            mensagem: 'Pedido inserido com sucesso!',
            pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos!',
                    url: process.env.URL_API + 'pedidos'
                }
            }
        }
        return res.status(201).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOnePedido = async (req, res, next) => {

    try {
        const result = await mysql.execute("SELECT * FROM pedidos WHERE id_pedido = ? ;",
            [req.params.id_pedido]);
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado pedidos com este ID"'
            })
        }
        const response = {
            pedido: {
                id_pedido: result[0].id_pedido,
                id_produto: result[0].id_produto,
                quantidade: result[0].quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos!',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deletePedido = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM pedidos WHERE id_pedido  = ?",
            [req.body.id_pedido]);
        const response = {
            mensagem: 'Pedido removido com sucesso!',
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido!',
                url: process.env.URL_API + 'pedidos',
                body: {
                    nome: 'String',
                    quantidade: 'Number'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};