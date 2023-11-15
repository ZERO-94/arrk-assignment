//create Mail class with constructor and getter setter for sender, receiver, message, sendAt, readAt
class Message {
  constructor(sender, receiver, message, sendAt, readAt) {
    this._sender = sender;
    this._receiver = receiver;
    this._message = message;
    this._sendAt = sendAt;
    this._readAt = readAt;
  }

  set sender(sender) {
    this._sender = sender;
  }

  get sender() {
    return this._sender;
  }

  set receiver(receiver) {
    this._receiver = receiver;
  }

  get receiver() {
    return this._receiver;
  }

  set message(message) {
    this._message = message;
  }

  get message() {
    return this._message;
  }

  set sendAt(sendAt) {
    this._sendAt = sendAt;
  }

  get sendAt() {
    return this._sendAt;
  }

  set readAt(readAt) {
    this._readAt = readAt;
  }

  get readAt() {
    return this._readAt;
  }
}

module.exports = Message;
