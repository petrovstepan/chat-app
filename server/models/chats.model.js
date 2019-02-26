const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'UserModel', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'MessageModel' },
  },
  {
    versionKey: false,
    collection: 'ChatCollection',
  }
)

module.exports = mongoose.model('ChatModel', ChatSchema)
