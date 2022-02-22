const mysql = require('../db');

exports.deleteImage = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM productimages WHERE imageId  = ?", 
        [req.params.imageId]
        );
        const response = {
            mensagem: 'Image successfully removed!',
            request: {
                tipo: 'POST',
                descricao: 'Product image!',
                url: process.env.URL_API + 'products/' + req.body.id_produto + '/images',
                body: {
                    productId: 'Number',
                    path: 'File'
                }
            }
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
