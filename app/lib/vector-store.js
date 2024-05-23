const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { embeddings } = require('./ai')
const { getConfig } = require('../config/db')

let vectorStore

const getVectorStore = async () => {
  if (vectorStore) {
    console.log('Returning existing vector store')
    return vectorStore
  }

  console.log('Initializing new vector store')

  vectorStore = new PGVectorStore(
    embeddings,
    await getConfig()
  )

  return vectorStore
}

module.exports = {
  getVectorStore
}
