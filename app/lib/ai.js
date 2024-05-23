const { OpenAIEmbeddings } = require('@langchain/openai')
const aiConfig = require('../config/ai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get embeddings: ${error}`)
  }
}

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: aiConfig.instanceName,
  azureOpenAIApiKey: aiConfig.apiKey,
  azureOpenAIApiDeploymentName: aiConfig.modelDeploymentName,
  azureOpenAIApiVersion: aiConfig.apiVersion,
  onFailedAttempt,
  verbose: true
})

module.exports = {
  embeddings
}
