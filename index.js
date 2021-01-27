const express = require('express')
const app = express()
const port = 3000
const Customer = require('./Models/Customer.js');

var customer1 = new Customer('Nouamane', 521423);

app.get('/', (req, res) => {
  var result = 'Hello World!' + '\n' + customer1.name + ' / ' + customer1.studentId;
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})