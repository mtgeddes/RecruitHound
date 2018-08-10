const express = require("express"),
      bodyParser = require("body-parser"),
      path = require('path'),
      crypto = require('crypto'),
      multer = require('multer'),
      GridFsStorage = require('multer-gridfs-storage'),
      Grid = require('gridfs-stream'),
      methodOverride = require('method-override'),
      http = require('http'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      cookieParser = require('cookie-parser'),
      session  = require('express-session'),
      mongodb = require("mongojs"),
      mongoose = require("mongoose"),
      routes = require("./routes"),
      db = require("./models"),
      app = express(),
      PORT = process.env.PORT || 3000;


// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
	secret: 'random phrase',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log('req.session:', req.session);
  return next();
}); // Used to display the current session info, debugging purposes only!

// Serve up static assets (usually on heroku)
app.use('/images', express.static("client/public/images"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client"));
}

// Add routes, both API and view
// app.use(routes);


// passport config
const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

require('./routes/api/passport-routes')(app);

// // Connect to the Mongo DB
// mongoose.connect();
// mongoose.Promise = Promise;


const conn = mongoose.createConnection(process.env.MONGODB_URI || "mongodb://localhost/main");

let gfs;

//test connection
conn.on('error', function (err) {
    console.log('Database Error: '+err)
});

conn.once('open', () =>  {
    console.log('Mongo Connection Success!')
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})


const storage = new GridFsStorage({
  url: 'mongodb://host:27017/database',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });



// Start the API server
app.listen(PORT, function() {
  console.log(`http://localhost: ${PORT}!`);
});