const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { DOC, PDF, DOCX, TXT } = require('../../constants/document-types')
const loadDocx = require('./docx')
const loadPdf = require('./pdf')
const loadText = require('./txt')

const loaders = {
  [DOCX]: loadDocx,
  [DOC]: loadDocx,
  [PDF]: loadPdf,
  [TXT]: loadText
}

const loadDocument = async (document) => {
  const loader = loaders[document.contentType]

  if (!loader) {
    throw new Error(`Unsupported document type: ${document.contentType}`)
  }

  const docs = await loader(document)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

  return splitter.splitDocuments(docs)
}

module.exports = {
  loadDocument
}
