const { connect } = require('../routes/produtos');

const mysql = require('../db');

exports.getProdutos = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM produtos;")
        const response = {
            quantidade: result.length,
            produtos: result.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem: prod.imagem,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os dados de um produtos!',
                        url: process.env.URL_API + 'produtos/' + prod.id_produto
                    }
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postProduto = async (req, res, next) => {
    try {
        const query = 'INSERT INTO produtos (nome, preco, imagem) VALUES (?,?,?)';
        const result = await mysql.execute(query, [
            req.body.nome, 
            req.body.preco, 
            req.file.path
        ]);
        const response = {
            mensagem: 'Produto inserido com sucesso!',
            produtoCriado: {
                id_produto: result.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos!',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneProduto = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM produtos WHERE id_produto = ? ;", [req.params.id_produto]);
        const response = {
            produto: {
                id_produto: result[0].id_produto,
                nome: result[0].nome,
                preco: result[0].preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos!',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateProduto = async (req, res, next) => {
    try {
        const result = await mysql.execute(`UPDATE produtos 
            SET nome          = ?, 
                preco         = ? 
            WHERE id_produto  = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ])
        const response = {
            mensagem: 'Produto atualisado com sucesso!',
            produto: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna os dados de um produtos!',
                    url: process.env.URL_API + 'produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteProduto = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM produtos WHERE id_produto  = ?", [req.body.id_produto]);
        const response = {
            mensagem: 'Produto removido com sucesso!',
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto!',
                url: process.env.URL_API + 'produtos',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postImagem = async (req, res, next) => {
    try {
        const originalPath = req.file.path;
        const imgPath = originalPath.replace('\\', '/');
        const query = 'INSERT INTO imagens_produtos (id_produto, caminho) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.params.id_produto,
            imgPath
        ]);
        const response = {
            mensagem: 'Imagem inserida com sucesso!',
            imagemCriada: {
                id_produto: req.params.id_produto,
                id_imagem: result.insertId,
                imagem_produto: process.env.URL_API + imgPath,
                // request: {
                //     tipo: 'GET',
                //     descricao: 'Retorna todos os produtos!',
                //     url: process.env.URL_API + 'produtos'
                // }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getImagens = async (req, res, next) => {
    try {
        const query = "SELECT * FROM imagens_produtos WHERE id_produto = ?;";
        const result = await mysql.execute(query, [req.params.id_produto]);
        const response = {
            quantidade: result.length,
            imagens: result.map(img => {
                return {
                    id_produto: req.params.id_produto,
                    id_imagem: img.id_produto,
                    caminho: process.env.URL_API + img.caminho,
                }
            })
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
