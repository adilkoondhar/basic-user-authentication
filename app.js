require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = mongoose.Schema({
    email: String, 
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.KEY, encryptedFields: ['password']})

const User = mongoose.model('User', userSchema)

app.route('/')
.get((req, res) => {
    res.render('home')
})

app.route('/login')
.get((req, res) => {
    res.render('login')
})
.post((req, res) => {
    User.findOne({'email': req.body.email} )
      .then((user) => {
        if(user.password == req.body.password) {
            res.render('secrets')
        } else {
            console.log('User not found')
        }
      })
  })

app.route('/register')
.get((req, res) => {
    res.render('register')
})
.post((req, res) => {
    const newUser = new User(req.body)

    newUser.save().then(() => {
        res.render('secrets')
    })
})

app.route('/secrets')
.get((req, res) => {
    res.render('secrets')
})

app.route('/submit')
.get((req, res) => {
    res.render('submit')
})

app.listen('3000')