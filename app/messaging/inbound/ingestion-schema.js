const Joi = require('joi')

const schema = Joi.object({
  document_id: Joi.string().uuid().required()
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
