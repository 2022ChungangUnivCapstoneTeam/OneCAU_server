const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')          // ./user.js
const config = require('../config')     // ../config.js
const fs = require('fs')

// Schema configuration :: Script -> Image
// Schema configuration :: Image
const Image = new Schema({
    generator : {
        type: Schema.Types.ObjectId,
        ref: User,
        unique : true
    },
    // add more key : value type if needed.
    image : String
});

// Create new user
Image.statics.create = function(user, imageLink){
    const image = new this({
        generator : user,
        image : imageLink
    })
    return image.save()
}

Image.statics.findOneByUser = function (user) {
    return this.findOne({ generator : user }).exec()
}

Image.statics.findOneAndReplaceImage = function(user, imageFileName) {
    // exception handling :: no-user
    if(!user) {
        throw new Error("no matching user")
    }

    const image = this.findOne({ generator : user }).exec()
        .then( image => {
            if(image){
                fs.unlink(__dirname + "/../images/" + image.image, (err) => {
                    if(err){
                        console.log(err)
                        return new Error('error occured while deleting images')
                    }
                })
                this.findOneAndUpdate(
                    { generator : image.generator},
                    { $set : { image : imageFileName }},
                    { returnNewDocument : true }
                    ).exec()
                    image.image = imageFileName
                    return image
            } else {
                const image = new this({
                    generator : user,
                    image : imageFileName
                })
                return image.save()
            }
        })
        return image
}

module.exports = mongoose.model('Image', Image)