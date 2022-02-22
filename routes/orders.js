const express = require('express');
const router = express.Router();

const PedidosController = require('../controllers/orders-controller');
router.get('/', PedidosController.getPedidos);
router.post('/', PedidosController.postPedidos);
router.get('/:id_pedido', PedidosController.getOnePedido);
router.delete('/', PedidosController.deletePedido);

module.exports = router;