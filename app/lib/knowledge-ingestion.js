const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { formatDocumentsAsString } = require('langchain/util/document')
const { saveKnowledge } = require('../storage/knowledge-document-repo')
const { getKnowledge, updateKnowledgeMetadata } = require('../storage/knowledge-document-repo')
const { loadDocument } = require('./document-loader')
const { loadWebpage } = require('./web-loader')
const { getVectorStore } = require('./vector-store')

const ingestDocument = async (id) => {
  const document = await getKnowledge(id)
  const texts = await loadDocument(id, document)

  const vectorStore = await getVectorStore()
  await vectorStore.addDocuments(texts)
}

const ingestWebpage = async (url, category, title) => {
  const docs = await loadWebpage(url)

  const documentStr = formatDocumentsAsString(docs)
  const documentBuffer = Buffer.from(documentStr)

  const id = await saveKnowledge(documentBuffer, 'text/plain')

  const metadata = {
    id,
    fileName: url,
    category,
    title,
    source: 'web'
  }

  await updateKnowledgeMetadata(id, metadata)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

  const texts = await splitter.splitDocuments(docs)

  const vectorStore = await getVectorStore()
  await vectorStore.addDocuments(texts)
}

module.exports = {
  ingestDocument,
  ingestWebpage
}
