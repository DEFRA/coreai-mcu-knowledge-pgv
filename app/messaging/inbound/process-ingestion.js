const util = require('util')
const { validateIngestionMessage } = require('./ingestion-schema')

const processIngestion = async (message, receiver) => {
  try {
    const { body } = validateIngestionMessage(message.body)
    console.log(`Processing ingestion: ${util.inspect(body)}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing ingestion:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processIngestion
}