const { getKnowledge } = require('../storage/knowledge-document-repo')
const { loadDocument } = require('./document-loader')
const { getVectorStore } = require('./vector-store')

const ingestDocument = async (id) => {
  const document = await getKnowledge(id)

  console.log(`Got document: ${document}`)

  const texts = await loadDocument(id, document)

  console.log(`Got texts: ${texts}`)

  const vectorStore = await getVectorStore()

  console.log(`Got vector store: ${vectorStore}`)

  await vectorStore.addDocuments(texts)

  console.log(`Added documents to vector store`)
}

module.exports = {
  ingestDocument
}
