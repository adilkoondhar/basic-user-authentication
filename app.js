const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 9

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = mongoose.Schema({
    email: String, 
    password: String
})


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
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if(result) {
                res.render('secrets')
            }
        });
      })
  })

app.route('/register')
.get((req, res) => {
    res.render('register')
})
.post((req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.email,
            password: hash
        })
    
        newUser.save().then(() => {
            res.render('secrets')
        })
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