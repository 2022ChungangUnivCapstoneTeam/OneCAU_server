const router = require('express').Router()  // express routing
const controller = require('./controller')
// const authMiddleware = require('../../middlewares/auth')
const multer = require('multer')            // node.js file upload
const { response } = require('express')

// multer disk storage configuration
const storage = multer.diskStorage({
    destination(request, file, cb) {    // cb: callback
        cb(null, 'images/')
    },
    filename : (req, file, cb) => {
        var filetype = '';
        if(file.mimetype === 'image/gif'){
            filetype = 'gif';
        }
        if(file.mimetype === 'image/png'){
            filetype = 'png';
        }
        if(file.mimetype === 'image/jpeg'){
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
})

// multer upload configuration
const upload = multer({ storage : storage })

// default signup
router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)
router.get('/signout', controller.signOut)

// router.get('/signin', (request, response) => {  // localhost:8080/api/signin
//     // response.sendFile(__dirname + '/test_login2.html');
// })

// test SSO login. ... passport.js
router.get('/login', (request, response) => {   // localhost:8080/api/signin
    console.log('/login page')
    console.log('dirname:' + __dirname)
    response.send({ name : john })
    // response.sendFile(__dirname + '/test_login.html');
})

router.post('/login/cau-sso', (request, response) => {
    console.log("/login/cau-sso need to be connected!");
})

// no signUp ... only SSO login required
// router.post('/signin', controller.signIn)

module.exports = router