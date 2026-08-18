require('dotenv').config()
const app = require('./src/app')
const dbConnnection = require('./src/config/dbConnection')

dbConnnection()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})