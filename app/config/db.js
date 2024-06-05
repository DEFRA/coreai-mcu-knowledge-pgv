const Joi = require('joi')
const { DefaultAzureCredential } = require('@azure/identity')

const schema = Joi.object({
  postgresConnectionOptions: Joi.object({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    ssl: Joi.boolean().required()
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
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === 'production'
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
  if (process.env.NODE_ENV === 'production') {
    console.log('Using managed identity for authentication')
    const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
    const { token } = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default', { requestOptions: { timeout: 1000 } })
    config.postgresConnectionOptions.password = token
  }

  const { error, value } = schema.validate(config)

  if (error) {
    throw new Error(`Postgres config validation error: ${error.message}`)
  }

  return value
}

module.exports = {
  getConfig
}
