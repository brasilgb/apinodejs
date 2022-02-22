const mysql = require('../db');

exports.deleteImagem = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM imagens_produtos WHERE id_imagem  = ?", 
        [req.params.id_imagem]
        );
        const response = {
            mensagem: 'Imagem removida com sucesso!',
            request: {
                tipo: 'POST',
                descricao: 'Imagens do produto!',
                url: process.env.URL_API + 'produtos/' + req.body.id_produto + '/imagens',
                body: {
                    id_produto: 'Number',
                    imagem_produto: 'File'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
