const { getKnowledge } = require('../storage/knowledge-document-repo')
const { loadDocument } = require('./document-loader')
const { getVectorStore } = require('./vector-store')

const ingestDocument = async (id) => {
  const document = await getKnowledge(id)

  const texts = await loadDocument(document)

  const vectorStore = await getVectorStore()
  
  await vectorStore.addDocuments(texts)
}

module.exports = {
  ingestDocument
}
