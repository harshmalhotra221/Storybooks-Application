const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv') 
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// connect to mongoDB
connectDB()

const app = express()
var store = new MongoDBStore({
  uri: 'mongodb+srv://Harryt1234:Harryt1234@bradscluster.edany.mongodb.net/storybooks?retryWrites=true&w=majority',
  collection: 'mySessions'
});

// Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Logging
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars Helpers
const { 
  formatDate, 
  stripTags, 
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')


// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //store: new MongoDBStore({ mongooseConnection: mongoose.connection }),
    //store: MongoDBStore.create({ mongoUrl: 'mongodb+srv://Harryt1234:Harryt1234@bradscluster.edany.mongodb.net/storybooks?retryWrites=true&w=majority'}) 
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// Catch errors
store.on('error', function(error) {
  console.log(error);
});
 
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    //maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
 
 //app.get('/', function(req, res) {
   //res.send('Hello ' + JSON.stringify(req.session));
 //});

app.use(require('morgan')('dev'));

const PORT = process.env.PORT || 3000

app.listen( 
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  )


 