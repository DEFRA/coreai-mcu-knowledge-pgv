const Joi = require('joi')

const schema = Joi.object({
  type: Joi.string().required().valid('document', 'webpage'),
  document_id: Joi.when('type', {
    is: 'document',
    then: Joi.string().uuid().required(),
    otherwise: Joi.forbidden()
  }),
  url: Joi.when('type', {
    is: 'webpage',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  category: Joi.when('type', {
    is: 'webpage',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  title: Joi.when('type', {
    is: 'webpage',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
})

const validateIngestionMessage = (message) => {
  const { value, error } = schema.validate(message)

  if (error) {
    throw new Error(`Invalid ingestion message: ${error.message}`)
  }

  return value
}

module.exports = {
  validateIngestionMessage
}
