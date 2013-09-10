var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')

module.exports = KeyCardReader

var initialized = false
  , buffer = ''
  , timeout
  , readers = []

function initialize() {
  if (initialized) return
  initialized = true

  if (document.addEventListener) {
    document.addEventListener('keypress', handleEvent, false)
  } else if (document.attachEvent) {
    document.attachEvent('onkeypress', handleEvent)
  } else {
    document.onkeypress = handleEvent
  }
}

function handleEvent(event) {
  event = event || window.event

  var key = String.fromCharCode(event.keyCode)
  buffer += key

  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(checkCode, 100)
}

function checkCode() {
  var value = buffer.trim()
  buffer = ''

  for (var i = 0; i < readers.length; i++) {
    if (value.length >= readers[i].min && readers[i].validate(value)) {
      readers[i].emit('code', value)
    }
  }
}

function KeyCardReader(options, cb) {
  if (!(this instanceof KeyCardReader)) return new KeyCardReader(options, cb)
  EventEmitter.call(this)

  options = options || {}

  this.min = options.min || 4
  if (options.validator) this.validate = options.validator

  if (cb) this.on('code', cb)

  readers.push(this)
  initialize()
}
inherits(KeyCardReader, EventEmitter)

KeyCardReader.prototype.destroy = function () {
  readers.splice(readers.indexOf(this), 1)
}

var reIsNumber = /^[0-9]+$/
KeyCardReader.prototype.validate = function (value) {
  return reIsNumber.test(value)
}
