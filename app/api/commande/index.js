const { Router } = require('express');
const EventEmitter = require('events');

const Stream = new EventEmitter();

Stream.on('message', (text) => {
  console.log(text);
});

const {
  Repas, Entree, Plat, Dessert, Boisson, Commande,
} = require('../../models');

const router = new Router();
router.get('/', (req, res) => { res.status(200).json(Commande.get()); });

/*
router.get('/sse', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders(); // flush the headers to establish SSE with client

  Stream.on('push', (event, data) => {
    res.write('event: ' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + ' \n\n');
  });
}); */

router.get('/stream', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  Stream.on('push', (event, data) => {
    response.write(`message: ${String(event)}\n` + `data: ${JSON.stringify(data)}\n\n`);
    // response.end();
  });

  response.on('close', () => {
    console.log('client dropped me');
  });
});

router.post('/', (req, res) => {
  try {
    const entree = req.body.repas.entree.nom;
    const plat = req.body.repas.plat.nom;
    const boisson = req.body.repas.boisson.nom;
    const dessert = req.body.repas.dessert.nom;
    const { prix } = req.body.repas;
    const tmp = {
      prix, entree, plat, boisson, dessert,
    };
    // console.log(tmp);
    const repas = Repas.create(tmp);
    const tmpOrder = {
      id: '1',
      repas: repas,
      status: 'PROGRESS',
      idClient: req.body.idClient,
    };
    const order = Commande.create(tmpOrder);
    // console.log(order);
    Stream.emit('push', 'new commande', { order });
    res.status(201).json(order);
    /* const entree = Entree.create(req.body.entree);
     const plat = Plat.create(req.body.plat);
     const boisson = Boisson.create(req.body.boisson);
     const dessert = Dessert.create(req.body.dessert); */
    /*     const entree = req.body.entree.nom;
        const plat = req.body.plat.nom;
        const boisson = req.body.boisson.nom;
        const dessert = req.body.dessert.nom;
        const prix = req.body.prix;
        const tmp = {prix, entree, plat, boisson, dessert,}; */

    /*const entree = req.body.entree.nom;
    const plat = req.body.plat.nom;
    const boisson = req.body.boisson.nom;
    const dessert = req.body.dessert.nom;
    const { prix } = req.body;
    const tmp = {
      prix, entree, plat, boisson, dessert,
    };
    // console.log(tmp);
    const repas = Repas.create(tmp);
    // Stream.emit('push', 'new repas', { repas });
    // Stream.emit('end');

    const tmpOrder = {
      id: '1',
      repas: repas,
      status: 'PROGRESS',
    };
    const order = Commande.create(tmpOrder);
    Stream.emit('push', 'new commande', { order });
    res.status(201).json(order);*/
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post('/validate', (req, res) => {
  try {
    Commande.update(req.body.id, { status: 'READY' });
    const order = Commande.getById(req.body.id);

    res.send(Commande.getById(req.body.id));
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
