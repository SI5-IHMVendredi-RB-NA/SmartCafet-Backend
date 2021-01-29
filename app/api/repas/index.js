const { Router } = require('express');
const EventEmitter = require('events');

const Stream = new EventEmitter();

Stream.on('message', (text) => {
  console.log(text)
})

const { Repas } = require('../../models');

const router = new Router();
router.get('/', (req, res) => { res.status(200).json(Repas.get()); });

router.get('/sse', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders(); // flush the headers to establish SSE with client

  Stream.on('push', (event, data) => {
    console.log('oui');
    res.write('event: ' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + ' \n\n');
  });
});

router.get('/stream', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  Stream.on('push', (event, data) => {
    response.write("message: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
  });
});

router.post('/', (req, res) => {
  try {
    const repas = Repas.create(req.body);
    Stream.emit("push", "test", { repas: repas });
    //Stream.emit('end');
    res.status(201).json(repas);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
