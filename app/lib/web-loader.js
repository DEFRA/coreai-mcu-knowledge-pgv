const { CheerioWebBaseLoader } = require('langchain/document_loaders/web/cheerio')

const loadWebpage = async (url) => {
  const loader = new CheerioWebBaseLoader(url)

  const rawDocs = await loader.load()

  return rawDocs
}

module.exports = {
  loadWebpage
}
