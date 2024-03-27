const { MessageReceiver } = require('ffc-messaging')
const { ingestionSubscription } = require('../config/messaging')
const { processIngestion } = require('./inbound/process-ingestion')

let ingestionReceiver

const start = async () => {
  const responseAction = message => processIngestion(message, ingestionReceiver)
  ingestionReceiver = new MessageReceiver(ingestionSubscription, responseAction)
  await ingestionReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await ingestionReceiver.closeConnection()
}

module.exports = { start, stop }
