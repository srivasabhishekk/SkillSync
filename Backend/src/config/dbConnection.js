const mongoose = require('mongoose')

async function dbConnection(){
    const uri = process.env.MONGO_URI

    try{
        const connect = await mongoose.connect(uri)
        console.log('Connected To Database')
        console.log(connect.connection.name, connect.connection.host)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = dbConnection