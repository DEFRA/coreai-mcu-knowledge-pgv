const Joi = require('joi')
const { DefaultAzureCredential } = require('@azure/identity')

const schema = Joi.object({
  postgresConnectionOptions: Joi.object({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().when('$NODE_ENV', { is: 'production', then: Joi.optional(), otherwise: Joi.required() }),
    database: Joi.string().required()
  }).required(),
  tableName: Joi.string().default('mcu_knowledge_vectors'),
  columns: Joi.object({
    idColumnName: Joi.string().default('id'),
    vectorColumnName: Joi.string().default('vector'),
    contentColumnName: Joi.string().default('content'),
    metadataColumnName: Joi.string().default('metadata')
  })
})

const config = {
  postgresConnectionOptions: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
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

const getConfig = async () => {
  console.log('Getting Postgres config')
  const { error, value } = schema.validate(config)

  if (process.env.NODE_ENV === 'production') {
    console.log('Using managed identity for authentication')
    const credential = new DefaultAzureCredential()
    const { token } = await credential.getToken('https://ossrdbms-aad.database.windows.net', { requestOptions: { timeout: 1000 } })
    config.postgresConnectionOptions.password = token
    console.log('Got PG MI token')
  }

  if (error) {
    throw new Error(`Postgres config validation error: ${error.message}`)
  }

  return value
}

module.exports = {
  getConfig
}
