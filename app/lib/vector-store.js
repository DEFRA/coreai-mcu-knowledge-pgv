const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { embeddings } = require('./ai')
const { getConfig } = require('../config/db')

let vectorStore

const getVectorStore = async () => {
  vectorStore = new PGVectorStore(
    embeddings,
    await getConfig()
  )

  return vectorStore
}

module.exports = {
  getVectorStore
}
