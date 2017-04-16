var express = require('express')
var app = express()
var port = process.env.PORT || 7777
var passport = require('./config/passport');
var dotenv = require('dotenv').config({ silent: true })
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser')
var MongoStore = require('connect-mongo')(session)

var dbURI = process.env.PROD_MONGODB
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(dbURI)

var ejsLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(ejsLayouts)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('really really connected. like for real!');
});


app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: dbURI })
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public')) // link css files and stuff

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use('/auth', require('./routers/auth'));

const itemRouter = require('./routers/item_router')
app.use('/', itemRouter)

app.get('/', function(req, res) {
  res.render('index')
})

app.listen(port, function() {
  console.log('express is running on port ' + port)
})
