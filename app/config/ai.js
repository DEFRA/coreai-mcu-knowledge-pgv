const Joi = require('joi')

const schema = Joi.object({
  instanceName: Joi.string().required(),
  apiKey: Joi.string().optional(),
  modelDeploymentName: Joi.string().required(),
  apiVersion: Joi.string().required()
})

const config = {
  instanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  apiKey: process.env.AZURE_OPENAI_KEY,
  modelDeploymentName: process.env.EMBEDDING_MODEL_NAME,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The storage config is invalid. ${error.message}`)
}

module.exports = value
