const { MessageReceiver } = require('ffc-messaging')
const { ingestionSubscription } = require('../config/messaging')

let ingestionReceiver

const start = async () => {
  const responseAction = message => console.log('Received message:', message.body)
  ingestionReceiver = new MessageReceiver(ingestionSubscription, responseAction)
  await ingestionReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await ingestionReceiver.closeConnection()
}

module.exports = { start, stop }
