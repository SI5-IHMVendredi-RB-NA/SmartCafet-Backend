const { Router } = require('express');
const EventEmitter = require('events');

const Stream = new EventEmitter();

Stream.on('message', (text) => {
  console.log(text);
});

const {
  Commande, Client,
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
let clients = [];
router.get('/stream/:id/:name', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const id_client = request.params.id;
  const tmp = { id_client: request.params.id, name: request.params.name };
  const client = Client.create(tmp);
  console.log(tmp);
  const newClient = {
    id_client,
    response,
  };
  clients.push(newClient);
  Stream.on('push', (event, data) => {
    response.write(`message: ${String(event)}\n` + `data: ${JSON.stringify(data)}\n\n`);
    // response.end();
  });

  response.on('close', () => {
    // console.log('client dropped me');
    console.log(`${id_client} Connection closed`);
    clients = clients.filter((c) => c.id !== id_client);
  });
});

router.post('/', (req, res) => {
  try {
    Commande.update(req.body.id, { status: 'READY' });
    const order = Commande.getById(req.body.id);
    // Stream.emit('push', 'updated commande', { order });
    clients.forEach((c) => {
      // console.log(c.id_client);
      // console.log(order.idClient);
      if (c.id_client == order.idClient) {
        c.response.write(`message: ${String('event')}\n` + `data: ${JSON.stringify(order)}\n\n`);
      }
    });
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
