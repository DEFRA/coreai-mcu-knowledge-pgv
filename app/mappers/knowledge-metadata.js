const blob = {
  id: 'id',
  fileName: 'file_name',
  title: 'title',
  category: 'category',
  source: 'source'
}

const base = {
  id: 'id',
  file_name: 'fileName',
  title: 'title',
  category: 'category',
  source: 'source'
}

const map = (metadata, lookup) => {
  const obj = {}

  for (const key in metadata) {
    obj[lookup[key]] = metadata[key]
  }

  return obj
}

const mapMetadataToBlob = (metadata) => map(metadata, blob)

const mapMetadataToBase = (metadata) => map(metadata, base)

module.exports = {
  mapMetadataToBlob,
  mapMetadataToBase
}
