const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const Repas = require('./repas.model');

module.exports = new BaseModel('Commande', {
  id: Joi.string().required(),
  repas: Joi.object().required(),
  status: Joi.string().required(),
  idClient: Joi.number().required(),
});
