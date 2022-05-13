const jwt = require('jsonwebtoken') // Web Token based authentication system
const User = require('../../db_models/user')
const Image = require('../../db_models/script')

const config = require('../../config')
const serverIP = config.serverName

// 회원가입
exports.signUp = (request, response) => {
    const { email, password } = request.body

    // const test = (user) => {
    //     console.log(request.body)
    //     console.log('Hi THERE!!')
    // }

    //create user if not exist
    const create = (user) => {
        // console.log(user)
        if(user) {
            if(user.email == email)
                throw new Error('duplicated')
        } else {
            console.log("user creating...")
            return User.create(email, password)
        }
    }
    const respond = () =>{
        response.json({
            header : {
                message : "success"
            },
            body : {
                email : email,
            }
        })
    }
    const onError = (error) => {
        response.status(409).json({
            message: error.message
        })
    }

    //check nickname duplication
    User.findOneByEmail(email)
        // .then(test)
        .then(create)
        .then(respond)
        .catch(onError)

}

// Login
exports.signIn = (request, response) => {
    // console.log(request.body)
    const { email, password } = request.body  // get from body
    const secret = request.app.get('jwt-secret')

    // const test = (user) => {
    //     console.log(request.body)
    //     console.log('Hi THERE!!')
    // }

    const check = (user) => {
        // user does not exist
        // console.log(user)
        if(!user) {
            // console.log('login failed')
            throw new Error('login failed!!')
        } else {
            if(user.verify(password)) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        { _id : user._id, email : user.email },
                        secret,
                        { expiresIn : '7d', issuer : 'onelink', subject : 'userInfo' },
                        (err, token) => {
                            if(err) reject(err)
                            resolve([token, user])
                        })
                })
                return p
            } else { throw new Error('login failed') }
        }
    }

    const respond = (token, user) => {
        response.cookie('token', token)
        response.json({
            header : { message : "success" },
            body : { email : email },
            token : token
        })
    }

    const onError = (error) => {
        // HTTP 403 stat :: req received by the server, but refused due to auth.
        response.status(403).json({ message : error.message })
    }

    User.findOneByEmail(email)
        // .then(test)
        .then(check)
        .then(([token, user]) => respond(token, user))
        .catch(onError)
}

exports.check = (request, response) => {
    response.json({
        success : true,
        info : request.decoded
    })
}

// Logout
exports.signOut = (request, response) => {
    response.cookie('token', null)
    response.status(204)
    response.json({
        header : { message : "success" }
    })
}

exports.storeImage = (request, response) => {
    const email = request.decoded.email
    const check_user = (user) => {
        return new Promise(function (resolve, reject) {
            if(!user) { throw new Error('There is no matching user') }
            resolve (user)
        })
    }

    const respond = (image) => {
        response.json({
            header : { message : "success" },
            body : { email : request.decoded.email, image : image.image }
        })
    }

    const onError = (error) => {
        // HTTP 409 stat :: conflict between current status of server and request.
        response.status(409).json({ message : error.message })
    }

    User.findOneByEmail(email)
        .then( (user) => check_user(user) )
        .then( (user) => {
            return Image.findOneAndReplaceImage(user, request.file.filename)
        })
        .then(respond)
        .catch(onError)
}

exports.getImage = (request, response) => {
    const email = request.decoded.email
    const check = (image) => {
        return new Promise(function (resolve, reject){
            if(!image) { throw new Error('has no image') }  // no image error
            resolve(image)
        })
    }

    const respond = (script) => {
        response.json({
            header : { message : "success" },
            body : { image : serverIP + image.image }
        })
    }

    const onError = (error) => {
        // HTTP 403 stat :: req received by the server, but refused due to auth.
        respond.status(403).json({ message : error.message })
    }

    User.findOneByEmail
        .then( (user) => Image.findOneByUser(user) )
        .then(check)
        .then(respond)
        .catch(onError)
}