const { v4: uuidv4 } = require('uuid')

const { blobServiceClient } = require('./get-blob-client')
const config = require('../config/storage')

const knowledgeContainer = blobServiceClient.getContainerClient(config.knowledgeContainer)

const saveDocument = async (buffer) => {
  const id = uuidv4()

  const blockBlobClient = knowledgeContainer.getBlockBlobClient(id)
  
  await blockBlobClient.uploadData(buffer, buffer.length)

  return id
}

module.exports = {
  saveDocument
}
