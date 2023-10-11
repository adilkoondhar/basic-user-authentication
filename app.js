const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.route('/')
.get((req, res) => {
    res.render('home')
})

app.route('/login')
.get((req, res) => {
    res.render('login')
})

app.route('/register')
.get((req, res) => {
    res.render('register')
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