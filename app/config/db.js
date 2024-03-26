const { DefaultAzureCredential } = require('@azure/identity')

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

const getConfig = async () => {
  if (process.env.NODE_ENV === 'production') {
    const credential = new DefaultAzureCredential()
    const token = await credential.getToken('https://ossrdbms-aad.database.windows.net', { requestOptions: { timeout: 1000 } })
    config.postgresConnectionOptions.password = token.token
  }

  return config
}

module.exports = {
  getConfig
}
