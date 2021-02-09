const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Boisson', {
  nom: Joi.string().required(),
  id: Joi.number().required(),
});
