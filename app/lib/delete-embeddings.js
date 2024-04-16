const { getVectorStore } = require('./vector-store')

const deleteEmbeddings = async (id) => {
  const vectorStore = await getVectorStore()

  const filter = {
    filter: { "documentId": id }
  }

  await vectorStore.delete(filter)
}

module.exports = {
  deleteEmbeddings
}
