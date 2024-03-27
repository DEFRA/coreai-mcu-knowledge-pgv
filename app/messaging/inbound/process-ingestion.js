const util = require('util')
const { validateIngestionMessage } = require('./ingestion-schema')
const { ingestDocument } = require('../../lib/knowledge-ingestion')

const processIngestion = async (message, receiver) => {
  try {
    const { body } = validateIngestionMessage(message.body)
    console.log(`Processing ingestion: ${util.inspect(body)}`)

    await ingestDocument(body.document_id)

    console.log(`Ingestion of document ${body.document_id} complete`)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing ingestion:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processIngestion
}
