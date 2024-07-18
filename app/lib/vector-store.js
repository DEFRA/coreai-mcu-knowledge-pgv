const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { embeddings } = require('./ai')
const { config } = require('../config/db')

const embeddings = getOpenAiEmbeddingsClient(openAi.embeddingsModelName)

const vectorStore = new PGVectorStore(
  embeddings,
  config
)

module.exports = {
  vectorStore
}