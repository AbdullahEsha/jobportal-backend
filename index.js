const app = require('./app')
const dbConnect = require('./utils/dbConn')

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('🌈🔥🎯☢️💯🚀🤖👨‍💻⚡')
})

app.listen(PORT, () => {
  console.log(
    `jobportal backend server is running on port http://localhost:${PORT}`,
  )
  dbConnect()
})
