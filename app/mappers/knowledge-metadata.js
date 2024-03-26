const base = {
  fileName: 'file_name',
  title: 'title',
  category: 'category',
  source: 'source'
}

const blob = {
  'file_name': 'fileName',
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

const mapMetadataToBlob = (metadata) => map(metadata, base)

const mapMetadataToBase = (metadata) => map(metadata, blob)

module.exports = {
  mapMetadataToBlob,
  mapMetadataToBase
}
