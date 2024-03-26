const { getKnowledge } = require('../storage/knowledge-document-repo')

const ingestDocument = async (id) => {
  const document = await getKnowledge(id)
}

module.exports = {
  ingestDocument
}
