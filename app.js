const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.route('/')
    .get((req, res) => {
        res.render('home');
    });

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(passport.authenticate('local', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
    }));

app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                return res.render('register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        });
    });

app.route('/secrets')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('secrets');
        } else {
            res.redirect('/login');
        }
    });

app.route('/logout')
    .get((req, res) => {
        req.logout(() => {
        res.redirect('/');
        });
    });

app.route('/submit')
    .get((req, res) => {
        res.render('submit');
    });

app.listen(3000, () => {
    console.log('Server started on port 3000');
});