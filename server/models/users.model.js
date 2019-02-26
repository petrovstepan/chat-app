const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    vkId: { type: String, unique: true, required: true },
    url: { type: String, unique: true, required: true },
    photo: String,
    addedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    collection: 'UsersCollection',
  }
)

module.exports = mongoose.model('UserModel', UserSchema)
