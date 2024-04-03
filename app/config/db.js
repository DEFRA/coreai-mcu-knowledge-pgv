const Joi = require('joi')
const { DefaultAzureCredential } = require('@azure/identity')

const schema = Joi.object({
  postgresConnectionOptions: Joi.object({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required()
  }).required(),
  tableName: Joi.string().default('mcu_knowledge_vectors'),
  columns: Joi.object({
    idColumnName: Joi.string().default('id'),
    vectorColumnName: Joi.string().default('vector'),
    contentColumnName: Joi.string().default('content'),
    metadataColumnName: Joi.string().default('metadata')
  }),
  aadEndpoint: Joi.string().default('https://ossrdbms-aad.database.windows.net')
})

const config = {
  postgresConnectionOptions: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  },
  tableName: 'mcu_knowledge_vectors',
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'vector',
    contentColumnName: 'content',
    metadataColumnName: 'metadata'
  }
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`Postgres config validation error: ${error.message}`)
}

const getConfig = async () => {
  if (process.env.NODE_ENV === 'production') {
    const credential = new DefaultAzureCredential()
    const { token } = await credential.getToken(value.aadEndpoint, { requestOptions: { timeout: 1000 } })
    value.postgresConnectionOptions.password = token
  }

  return value
}

module.exports = {
  getConfig
}
