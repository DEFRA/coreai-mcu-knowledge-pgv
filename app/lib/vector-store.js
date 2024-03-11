const { OpenAIEmbeddings } = require('@langchain/openai')
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const dbConfig = require('../config/db')()

const saveVectors = async (documents) => {
  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
    azureOpenAIApiDeploymentName: process.env.EMBEDDING_MODEL_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
  })
  
  const pgvectorStore = await PGVectorStore.initialize(
    embeddings,
    dbConfig
  )
  
  await pgvectorStore.addDocuments(documents)

  await pgvectorStore.end()
}

module.exports = {
  saveVectors
}
