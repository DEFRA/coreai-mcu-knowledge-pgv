const { OpenAIEmbeddings } = require('@langchain/openai')
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { getConfig } = require('../config/db')
const aiConfig = require('../config/ai')

const ingestDocument = async (document) => {
  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiInstanceName: aiConfig.instanceName,
    azureOpenAIApiKey: aiConfig.apiKey,
    azureOpenAIApiDeploymentName: aiConfig.modelDeploymentName,
    azureOpenAIApiVersion: aiConfig.apiVersion
  })
  
  const store = await PGVectorStore.initialize(
    embeddings,
    await getConfig()
  )
  
  await store.addDocuments(document)

  await store.end()
}

module.exports = {
  ingestDocument
}
