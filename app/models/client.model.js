const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Client', {
  id_client: Joi.string().required(),
  name: Joi.string().required(),
});
