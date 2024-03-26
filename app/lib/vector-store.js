const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { embeddings } = require('./ai')
const { getConfig } = require('../config/db')

const vectorStore = await PGVectorStore.initialize(
  embeddings,
  await getConfig()
)

module.exports = {
  vectorStore
}
