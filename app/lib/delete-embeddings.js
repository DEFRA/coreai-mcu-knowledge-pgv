const { vectorStore } = require('./vector-store')

const deleteEmbeddings = async (id) => {
  const filter = {
    filter: { documentId: id }
  }

  await vectorStore.delete(filter)
}

module.exports = {
  deleteEmbeddings
}
