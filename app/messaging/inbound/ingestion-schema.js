const Joi = require('joi')

const schema = Joi.object({
    body: Joi.object({
      document_id: Joi.string().uuid().required()  
    }).required(),
    source: Joi.string().required(),
    type: Joi.string().required()
})

const validateIngestionMessage = (message) => {
    const { value, error } = schema.validate(message)

    if (error) {
        throw new Error(`Invalid response message: ${error.message}`)
    }

    return value
}

module.exports = {
    validateIngestionMessage
}
