require('dotenv').config()
const express = require('express')
const authUser = require('./routes/auth')
const routerUser = require('./routes/user')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { verifyAdmin } = require('./middlewares/auth')
const app = express()

//middleware
app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
)
app.use(cookieParser())
// app.use(verifyAdmin);

//base route
app.use('/api/v1/user', routerUser)
app.use('/api/v1/auth', authUser)

module.exports = app
