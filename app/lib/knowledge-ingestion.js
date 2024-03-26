const { getKnowledge } = require('../storage/knowledge-document-repo')
const { vectorStore } = require('./vector-store')

const ingestDocument = async (id) => {
  const document = await getKnowledge(id)
  console.log(document)
}

module.exports = {
  ingestDocument
}
