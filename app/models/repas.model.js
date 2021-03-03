const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Repas', {
  entree: Joi.string().required(),
  boisson: Joi.string().required(),
  plat: Joi.string().required(),
  dessert: Joi.string().required(),
  prix: Joi.number().required(),
});
