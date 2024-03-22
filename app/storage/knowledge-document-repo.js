const { v4: uuidv4 } = require('uuid')

const { blobServiceClient } = require('./get-blob-client')
const config = require('../config/storage')

const knowledgeContainer = blobServiceClient.getContainerClient(config.knowledgeContainer)

const saveKnowledge = async (buffer, type) => {
  const id = uuidv4()

  const blockBlobClient = knowledgeContainer.getBlockBlobClient(id)

  const options = {
    blobHTTPHeaders: {
      blobContentType: type
    }
  }
  
  await blockBlobClient.uploadData(buffer, options)

  return id
}

const updateKnowledgeMetadata = async (id, metadata) => {
  const blockBlobClient = knowledgeContainer.getBlockBlobClient(id)

  if (!await blockBlobClient.exists()) {
    const err = new Error(`The knowledge document with ID ${id} does not exist`)

    err.code = 'NotFound'

    throw err
  }

  await blockBlobClient.setMetadata(metadata)
}

module.exports = {
  saveKnowledge,
  updateKnowledgeMetadata
}
