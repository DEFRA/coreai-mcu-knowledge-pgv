const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { embeddings } = require('./ai')
const { getConfig } = require('../config/db')

let vectorStore

const getVectorStore = async () => {
  if (vectorStore) {
    return vectorStore
  }

  vectorStore = await PGVectorStore.initialize(
    embeddings,
    await getConfig()
  )

  return vectorStore
}

module.exports = {
  getVectorStore
}
