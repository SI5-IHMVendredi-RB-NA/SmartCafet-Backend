const { Router } = require('express');
const TicketRouter = require('./tickets');
const RepasRouter = require('./repas');

const router = new Router();
router.get('/status', (req, res) => res.status(200).json('ok'));
router.use('/tickets', TicketRouter);
router.use('/repas', RepasRouter);

module.exports = router;
