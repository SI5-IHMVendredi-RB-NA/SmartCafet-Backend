const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const Entree = require('./entree.model');
const Plat = require('./plat.model');
const Dessert = require('./dessert.model');
const Boisson = require('./boisson.model');

module.exports = new BaseModel('Repas', {
  // nom: Joi.string().required(),
  entree: Joi.string().required(),
  boisson: Joi.string().required(),
  plat: Joi.string().required(),
  dessert: Joi.string().required(),
  prix: Joi.number().required(),
  /*entree: Entree.getSchema(),
  boisson: Boisson.getSchema(),
  plat: Plat.getSchema(),
  dessert: Dessert.getSchema(),
  prix: Joi.number().required(),*/
});

