const express = require('express')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to SkillSync!')
})


module.exports = app