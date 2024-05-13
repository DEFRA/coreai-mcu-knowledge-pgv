const util = require('util')
const { validateIngestionMessage } = require('./ingestion-schema')
const { ingestDocument, ingestWebpage } = require('../../lib/knowledge-ingestion')

const processIngestion = async (message, receiver) => {
  try {
    const body = validateIngestionMessage(message.body)
    console.log(`Processing ingestion: ${util.inspect(body)}`)

    if (body.type === 'document') {
      await ingestDocument(body.document_id)

      console.log(`Ingestion of document ${body.document_id} complete`)
    } else if (body.type === 'webpage') {
      await ingestWebpage(body.url, body.category, body.title)

      console.log(`Ingestion of webpage at ${body.url} complete`)
    } else {
      throw new Error(`Unsupported ingestion type: ${body.type}`)
    }

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing ingestion:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processIngestion
}
