require('dotenv').config()
const mongoose = require('mongoose')

const dbConnect = () => {
  const connUri = process.env.MONGODB_URL

  mongoose
    .connect(connUri)
    .then(() => {
      console.log('db connected successfully.')
    })
    .catch((err) => console.error(`mongodb connection error: ${err}`))
}

module.exports = dbConnect
