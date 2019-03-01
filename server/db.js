const mongoose = require('mongoose')
const db = require('./config/db')

module.exports = () => {
  if (db.uri) {
    mongoose.connect(db.uri, {
      useNewUrlParser: true,
    })
  } else {
    mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
      useNewUrlParser: true,
    })
  }
}
