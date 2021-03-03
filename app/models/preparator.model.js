const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Preparator', {
  id_preparator: Joi.string().required(),
  name: Joi.string().required(),
});
