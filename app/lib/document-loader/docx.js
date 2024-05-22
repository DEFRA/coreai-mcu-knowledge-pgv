const { Blob } = require('buffer')
const { DocxLoader } = require('langchain/document_loaders/fs/docx')

const load = async (document) => {
  console.log('Loading docx')
  const blob = new Blob([document.buffer])

  const loader = new DocxLoader(blob)

  return loader.load()
}

module.exports = load
