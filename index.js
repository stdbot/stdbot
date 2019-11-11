const { EventEmitter } = require('events')

function Stdbot (adapter) {
  const emitter = new EventEmitter()

  const formatMessage = emitter.formatMessage = message =>
    Object.assign({}, message, {
      send: (text, options) => emitter.send(message, text, options),
      reply: text => emitter.reply(message, text)
    }, emitter.edit && {
      edit: text => emitter.edit(message, text)
    }, emitter.tag && {
      tag: text => emitter.tag(message, text)
    }, emitter.react && {
      react: emoji => emitter.react(message, emoji)
    })

  adapter.on('error', err => emitter.emit('error', err))
  adapter.on('load', state => emitter.emit('load', state))
  adapter.on('message', message => emitter.emit('message', formatMessage(message)))

  emitter.mention = adapter.mention
  emitter.address = adapter.address
  emitter.mentions = adapter.mentions
  emitter.isMentioned = adapter.isMentioned
  emitter.end = adapter.end

  emitter.send = (message, text, options) => adapter.send(message, text, options).then(formatMessage)

  if (adapter.edit) {
    emitter.edit = (message, text) => adapter.edit(message, text).then(formatMessage)
  }

  if (adapter.tag) {
    emitter.tag = (message, text) => adapter.tag(message, text).then(formatMessage)
  }

  if (adapter.react) {
    emitter.react = (message, emoji) => adapter.react(message, emoji).then(formatMessage)
  }

  emitter.reply = (message, text) =>
    emitter.send(message, emitter.address(message.author, text))

  emitter.messageRoom = (room, text) =>
    adapter.messageRoom(room, text).then(formatMessage)

  return emitter
}

module.exports = Stdbot
