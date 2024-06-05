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

const loadDocument = async (documentId, document) => {
  const blobMetadata = document.metadata

  const loader = loaders[document.contentType]

  if (!loader) {
    throw new Error(`Unsupported document type: ${document.contentType}`)
  }

  let docs

  try {
    docs = await loader(document)
  } catch (err) {
    console.error(`Error loading document ${documentId}:`, err)
    
    throw err
  }

  const docsWithMetadata = docs.map(doc => ({
    ...doc,
    metadata: {
      documentId,
      ...doc.metadata,
      blobMetadata: {
        ...blobMetadata,
        contentType: document.contentType
      }
    }
  }))

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

  return splitter.splitDocuments(docsWithMetadata)
}

module.exports = {
  loadDocument
}
