const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ChatModel = require('./chats.model')
const _ = require('lodash')

const MessageSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    chatId: Schema.Types.ObjectId,
    text: String,
    userId: Schema.Types.ObjectId,
  },
  {
    versionKey: false,
    collection: 'MessageCollection',
  }
)

MessageSchema.pre('save', function(next) {
  this.text = _.escape(this.text)
  next()
})

MessageSchema.post('save', function(doc, next) {
  console.log(doc)
  //var SchemaVar = require(‘mongoose’).model(‘nameOfTheModel’).schema
  ChatModel.findOneAndUpdate(
    { _id: doc.chatId },
    { lastMessage: doc._id },
    {},
    (err, chat) => {
      console.log(`lastMessage: ${doc._id}`)
      console.log('post save')
      console.log(chat)
      console.log(err)
    }
  )
  next()
})

module.exports = mongoose.model('MessageModel', MessageSchema)
