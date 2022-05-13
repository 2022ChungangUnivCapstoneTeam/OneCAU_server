// load the dependencies
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

// load config.js
const config = require('./config')
const PORT = process.env.PORT || config.serverPort

// express configuration
const app = express()

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

// index page just for testing.
app.get('/', (request, response) => {
    response.send('Hello JWT')
})

// configure express router API
app.use('/api', require('./routes/api'))

//set the secret key variable for jwt
app.set('jwt-secret', config.secretKey)

// open backend server
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
}).then( () => console.log("mongoDB connection establish... Done") )
.catch(err => console.log(err))

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("successfully connected to mongoDB")
})

app.use(express.static(path.join((__dirname, 'scripts'))))