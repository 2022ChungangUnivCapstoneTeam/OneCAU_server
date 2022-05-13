const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')        // Node.js 'crypto' module
const config = require('../config')     // ../config.js

// Schema configuration :: User
const User = new Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    // profileImage : String,
    // userName : String
});

/* 중앙대학교 인증하고 저장하려면 어떻게 해야할까.. */

// Create new user
User.statics.create = function (email, password) {
    // encryption with HMAC(Hash-based Msg Auth Code)
    // 1. use 'sha1' algo with secret key in config.js file to create HMAC
    // 2. and update HMAC contents(the target content to be encrypted is 'password')
    // 3. then digest(represent) the encrypted content as base64.
    const encrypted = crypto.createHmac('sha1', config.secretKey).update(password).digest('base64')
    const user = new this({
        email,
        password : encrypted,   // save encrypted password
    })
    return user.save()
}

// User password verify
User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secretKey).update(password).digest('base64')
    return this.password === encrypted
}

// Find one by email
User.statics.findOneByEmail = function (email) {
    return this.findOne({ email }).exec()
}

module.exports = mongoose.model('User', User)