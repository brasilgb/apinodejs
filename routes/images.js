const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ImagensController = require('../controllers/images-controller');

router.delete('/:id_imagem', login.required, ImagensController.deleteImagem);

module.exports = router;