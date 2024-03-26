const { OpenAIEmbeddings } = require('@langchain/openai')
const aiConfig = require('../config/ai')

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: aiConfig.instanceName,
  azureOpenAIApiKey: aiConfig.apiKey,
  azureOpenAIApiDeploymentName: aiConfig.modelDeploymentName,
  azureOpenAIApiVersion: aiConfig.apiVersion
})

module.exports = {
  embeddings
}
