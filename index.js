const { EventEmitter } = require('events')

function Stdbot (adapter) {
  const emitter = new EventEmitter()

  const formatMessage = message =>
    Object.assign({}, message, {
      send: text => emitter.send(message, text),
      reply: text => emitter.reply(message, text)
    }, emitter.edit && {
      edit: text => emitter.edit(message, text)
    })

  adapter.on('error', err => emitter.emit('error', err))
  adapter.on('load', state => emitter.emit('load', state))
  adapter.on('message', message => emitter.emit('message', formatMessage(message)))

  emitter.mention = adapter.mention
  emitter.address = adapter.address
  emitter.mentions = adapter.mentions
  emitter.isMentioned = adapter.isMentioned
  emitter.end = adapter.end

  emitter.send = (message, text) => adapter.send(message, text).then(formatMessage)
  emitter.edit = (message, text) => adapter.edit(message, text).then(formatMessage)

  emitter.reply = (message, text) =>
    emitter.send(message, emitter.address(message.author, text))

  emitter.messageRoom = (room, text) =>
    adapter.messageRoom(room, text).then(formatMessage)

  return emitter
}

module.exports = Stdbot
