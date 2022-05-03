// load the dependencies
const express = require('express')
const mongoose = require('mongoose')

// load config.js
const config = require('./config')
const PORT = process.env.PORT || config.serverPort

// express configuration
const app = express()

// index page just for testing.
app.get('/', (request, response) => {
    response.send('Hello JWT')
})

app.listen(PORT, () => {    // ./config.js
    console.log('Express server running on port', PORT)
})

// connect to mongoDB
mongoose.connect(config.mongodbUri, {
    // mongoose version 6^ :: no need for these code
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
    // useCreateIndex : true,
    // useFindAndModify : false
}).then( () => console.log("mongoDB connection establish...") )
.catch(err => console.log(err))

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("successfully connected to mongoDB")
})

