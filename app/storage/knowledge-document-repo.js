const { v4: uuidv4 } = require('uuid')
const { blobServiceClient } = require('./get-blob-client')
const config = require('../config/storage')
const { mapMetadataToBlob, mapMetadataToBase } = require('../mappers/knowledge-metadata')

const knowledgeContainer = blobServiceClient.getContainerClient(config.knowledgeContainer)

const getKnowledge = async (id) => {
  const client = knowledgeContainer.getBlockBlobClient(id)

  if (!await client.exists()) {
    const err = new Error(`The knowledge document with ID ${id} does not exist`)

    err.code = 'NotFound'

    throw err
  }

  const document = await client.downloadToBuffer()
  const metadata = await client.getProperties()

  return {
    document,
    metadata: mapMetadataToBase(metadata.metadata)
  }
}

const saveKnowledge = async (buffer, type) => {
  const id = uuidv4()

  const client = knowledgeContainer.getBlockBlobClient(id)

  const options = {
    blobHTTPHeaders: {
      blobContentType: type
    }
  }

  await client.uploadData(buffer, options)

  return id
}

const updateKnowledgeMetadata = async (id, metadata) => {
  const client = knowledgeContainer.getBlockBlobClient(id)

  if (!await client.exists()) {
    const err = new Error(`The knowledge document with ID ${id} does not exist`)

    err.code = 'NotFound'

    throw err
  }

  const mapped = mapMetadataToBlob(metadata)

  await client.setMetadata(mapped)
}

module.exports = {
  getKnowledge,
  saveKnowledge,
  updateKnowledgeMetadata
}
