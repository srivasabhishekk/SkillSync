require('dotenv').config()
const app = require('./src/app')
const dbConnnection = require('./src/config/dbConnection')

dbConnnection()

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})