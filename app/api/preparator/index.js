const { Router } = require('express');
const EventEmitter = require('events');

const Stream = new EventEmitter();

Stream.on('message', (text) => {
  console.log(text);
});

const {
  Commande,
} = require('../../models');

const router = new Router();
router.get('/', (req, res) => { res.status(200).json(Commande.get()); });

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

  Stream.on('rush', (event, data) => {
    console.log("ALLO rush?")
    response.write(`message: ${String(event)}\n` + `data: ${data}\n\n`);
    // response.end();
  });

  response.on('close', () => {
    console.log('client dropped me');
  });
});

router.post('/rush', (req, res) => {
  try {
    console.log(`rushmode ${req.body.rush} !`);
    Stream.emit('rush', 'gogogo', 'rush');
    // res.send('OK RUSH');
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post('/vague', (req, res) => {
  try {
    console.log('inside vague called !');
    Stream.emit('push', 'vague ended', { id_preparator: req.body.id, name_preparator: req.body.name });
    // res.send('Vague ended by ' + req.body.name + ' #' + req.body.id);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
