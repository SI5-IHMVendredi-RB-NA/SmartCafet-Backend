const { Router } = require('express');
const TicketRouter = require('./tickets');
const RepasRouter = require('./repas');
const OrderRouter = require('./commande');
const UserRouter = require('./client');

const router = new Router();
router.get('/status', (req, res) => res.status(200).json('ok'));
router.use('/tickets', TicketRouter);
router.use('/repas', RepasRouter);
router.use('/order', OrderRouter);
router.use('/user', UserRouter);

module.exports = router;
