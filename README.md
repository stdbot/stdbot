# stdbot

> Basically, [Hubot][hubot] as a library.

[hubot]: https://hubot.github.com/

## Overview

**stdbot** aims to provide a universal API for bots to interact with
chat rooms, via a number of [adapters](#adapters).

## Adapters

* [IRC](https://github.com/stdbot/irc)
* [Slack](https://github.com/stdbot/slack)
* [Flowdock](https://github.com/stdbot/flowdock)

## Installation

```sh
npm install --save stdbot
npm install --save stdbot-flowdock # Use the adapter of your choice
```

## Usage

```js
const Stdbot = require('stdbot')
const Flowdock = require('stdbot-flowdock')

const bot = Stdbot(Flowdock({
  token: 'my-token',
  flows: ['main']
}))
```

Tweak the code with the adapter of your choice, and its specific options
(documented in the adapter readme).

### Events

The `bot` object is an `EventEmitter`.

* All errors are sent through the `error` event.
* You can listen for `message` events.

See [objects](#objects) for message format.

### Methods

* `send` a message in the context of another message (for
  example, same thread).
* `reply `to a message, mentioning its author.
* `edit` a message you sent.
* `messageRoom` to send a message to a room without context.

Each of these methods return a promise yielding the message object
representing the message you sent.

* `mention` an user in the adapter format (for example prefixing its
  name by a `@`.
* `address` a message to an user for example by mentioning them and
  adding a suffix like `, ` or `: `.
* `isMentioned` to tell if a user is mentioned in a message.
* `end` the stream to stop listening.

## Example

```js
bot.on('message', message => {
  // Send a message in the same thread
  message.send(`Hello, ${bot.mention(message.author)}!`)
  // bot.send(message, `Hello, ${bot.mention(message.author)}!`)

  // Same, but mention the message author
  message.reply(`Hello, ${bot.mention(message.author)}!`)
  // bot.reply(message, `Hello, ${bot.mention(message.author)}!`)

  // Edit your own message (if supported by adapter)
  message.send(`Hello, ${bot.mention(message.author)}!`)
    .then(myMessage => myMessage.edit(bot.address(message.author, 'Hello!')))
    // .then(myMessage => bot.edit(myMessage, bot.address(message.author, 'Hello!')))
    .then(myEditedMessage => {})
})

// Send a message in a room
bot.messageRoom('main', 'Hello, world!')
```

## Objects

Object structure is strongly inspired by [Schema.org][schema]
naming, especially [`Person`][schema-person] for users and
[`EmailMessage`][schema-email] for messages.

[schema]: https://schema.org/
[schema-person]: https://schema.org/Person
[schema-email]: https://schema.org/EmailMessage

### User

| Name       | Type     | Description                  |
|------------|----------|------------------------------|
| `raw`      | `Object` | Raw user object from adapter |
| `id`       | `String` | User ID                      |
| `name`     | `String` | User nickname                |

Some adapters may provide other information, like `fullName`, `email`,
`image`, `url`.

### Message

| Name     | Type     | Description                     |
|----------|----------|---------------------------------|
| `raw`    | `Object` | Raw message object from adapter |
| `id`     | `String` | Message ID                      |
| `author` | `User`   | User who sent the message       |
| `text`   | `String` | Message text content            |

## Why not Hubot?

The main reason to *not* use Hubot in some cases is because Hubot and
its adapters can hardly be used as a library. Neither Hubot nor its
adapters are meant to be required by third party code:

* Hubot and its adapters require CoffeeScript to run, and the code is
  not precompiled to JavaScript, requiring you to run your whole project
  through CoffeeScript if you want to require it.
* Hubot will take ownership of the whole console output and process
  error handling, which is not suitable when used as a library.
* Hubot adapters can't be used standalone because they depend completely
  on the Hubot environment.

This is okay, since Hubot is not a library, and its adapters are not
designed for portability. stdbot is an alternative that you can use in
your own applications, instead of having your scripts be executed
*inside* Hubot.

## See also

* [Switch][switch], similar project, built around [RxJS][rxjs]. Unlike
  stdbot, switch aims to be exhaustive in the events and features
  exposed by the adapter, while stdbot is more like a common denominator
  between supported adapters, with a simple but limited feature set.

[switch]: https://github.com/broidhq/switch
[rxjs]: https://github.com/Reactive-Extensions/RxJS
