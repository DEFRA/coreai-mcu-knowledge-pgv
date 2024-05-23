const { v4: uuidv4 } = require('uuid')
const { getBlobClient } = require('./get-blob-client')
const config = require('../config/storage')
const { mapMetadataToBlob, mapMetadataToBase } = require('../mappers/knowledge-metadata')

const knowledgeContainer = getBlobClient().getContainerClient(config.knowledgeContainer)

const listKnowledge = async (search = '', category = '', orderBy = 'lastModified ', orderByDirection = 'Desc') => {
  const blobs = []

  const listOptions = {
    includeCopy: false,
    includeDeleted: false,
    includeDeletedWithVersions: false,
    includeLegalHold: false,
    includeMetadata: false,
    includeSnapshots: true,
    includeTags: true,
    includeUncommitedBlobs: false,
    includeVersions: false,
    prefix: ''
  }

  for await (const blob of knowledgeContainer.listBlobsFlat(listOptions)) {
    const metadata = mapMetadataToBase(blob.metadata)
    blob.metadata = metadata
    const metaCategory = metadata.category

    if (search !== '' && metadata.fileName) {
      search = search.toLowerCase()
      const metaFilename = metadata.fileName.toLowerCase()

      if (metaFilename.indexOf(search) > -1) {
        if (metaCategory && category !== '' && metaCategory === category) {
          blobs.push(blob)
        } else if (category === '') {
          blobs.push(blob)
        }
      }
    } else if (metaCategory && (category === '' || metaCategory === category)) {
      blobs.push(blob)
    }
  }

  return sortBlobs(blobs, orderBy, orderByDirection)
}

const sortBlobs = (blobs, orderBy = 'lastModified ', orderByDirection = 'Desc') => {
  return blobs.sort((a, b) => {
    const aValue = new Date(a.properties[orderBy])
    const bValue = new Date(b.properties[orderBy])

    if (orderByDirection === 'Desc') {
      return bValue - aValue
    } else {
      return aValue - bValue
    }
  })
}

const initialiseContainers = async () => {
  await knowledgeContainer.createIfNotExists()
}

const getKnowledge = async (id) => {
  const client = knowledgeContainer.getBlockBlobClient(id)

  if (!await client.exists()) {
    const err = new Error(`The knowledge document with ID ${id} does not exist`)

    err.code = 'NotFound'

    throw err
  }

  const buffer = await client.downloadToBuffer()
  const properties = await client.getProperties()

  const metadata = mapMetadataToBase(properties.metadata)
  const contentType = properties.contentType

  return {
    buffer,
    metadata,
    contentType
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

const deleteKnowledge = async (id) => {
  const client = knowledgeContainer.getBlockBlobClient(id)

  if (!await client.exists()) {
    const err = new Error(`The knowledge document with ID ${id} does not exist`)

    err.code = 'NotFound'

    throw err
  }

  await client.delete({ ids: [id] })
}

module.exports = {
  listKnowledge,
  getKnowledge,
  saveKnowledge,
  updateKnowledgeMetadata,
  initialiseContainers,
  deleteKnowledge
}
