const { ManagedIdentityCredential, getBearerTokenProvider } = require('@azure/identity')
const { AzureOpenAIEmbeddings } = require('@langchain/openai')
const aiConfig = require('../config/ai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get embeddings: ${error}`)
  }
}

const tokenProvider = getBearerTokenProvider(
  new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID),
  'https://cognitiveservices.azure.com/.default'
)

const getConfig = () => {
  const config = {
    azureOpenAIApiVersion: aiConfig.apiVersion,
    azureOpenAIApiInstanceName: aiConfig.instanceName,
    onFailedAttempt,
    verbose: true
  }

  if (aiConfig.apiKey) {
    console.log('Using Azure OpenAI API key')

    return {
      ...config,
      azureOpenAIApiKey: aiConfig.apiKey
    }
  }

  console.log('Using managed identity')

  return {
    ...config,
    azureADTokenProvider: tokenProvider
  }
}

const embeddings = new AzureOpenAIEmbeddings({
  ...getConfig(),
  azureOpenAIApiDeploymentName: aiConfig.modelDeploymentName
})

module.exports = {
  embeddings
}
