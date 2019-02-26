const mongoose = require('mongoose')
const db = require('./config/db')

module.exports = () => {
  mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
    useNewUrlParser: true,
  })
}
