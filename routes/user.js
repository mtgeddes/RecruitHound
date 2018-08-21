// Requiring our dependencies 
const
  passport = require('passport'),
  User = require('../models/user'),
  mongojs = require('mongojs'),
  multer = require('multer'),
  GridFsStorage = require('multer-gridfs-storage'),
  email 	= require("emailjs"),
  savedRecruiter = require("../models/savedRecruiter"),
  server 	= email.server.connect({
    user: 'hello@ryanadiaz.com',
    password: 'testpassword',
    host: 'mail.ryanadiaz.com',
    port: 587,
    tls:  false
  });

// Database configuration
const databaseUrl = "main";

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl);
db.on("error", function(error) {
    console.log("Database Error:", error);
});  

module.exports = function(app, gfs) {

  const database = mongojs('main')

  // Create storage engine for files/images
  const storage = new GridFsStorage({
    url: 'mongodb://localhost/main',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        console.log("new picture object fired")
        console.log('//////////////////')
        console.log(req.body)
        console.log(file.originalname)
        console.log('//////////////////')
        const fileInfo = {
          filename: file.originalname,
          bucketName: 'uploads',
          metadata: {filename:req.body.file[0], purpose: req.body.file[1]}
        };
        resolve(fileInfo);
      });
    }
  });

  const upload = multer({ storage });


  /////////////// Upload image routes ///////////////

  // @route POST /upload
  // @desc Uploads file to DB
  app.post('/upload', upload.single('file'), (req, res) => {
    console.log("new picture upload fired")
    res.redirect('/user-dashboard')
  })
 
  // @route DELETE /files/:id
  // @desc  Delete file
  app.delete('/files/:filename/:purpose', (req, res) => {
    console.log("picture delete fired")
    gfs.files.remove({metadata:{filename: req.params.filename, purpose: req.params.purpose}}, (err, GridFSBucke) => {
      if (err) {
        return res.status(404).json({err: err})
      } 
      res.redirect('/user-dashboard')
    })
  })

  // @route GET /image/:filename
  // @desc Display Image
  app.get('/image/:filename/:purpose', (req, res) => {
  
    gfs.files.findOne({metadata:{filename: req.params.filename, purpose: req.params.purpose}}, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exist"
        });
      }
      // Check if image
      if (file.contentType === 'image/jpeg' 
      || file.contentType === 'img/png') {
        // Read output to browser 
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        
      } else {
        res.status(404).json({
          err: 'Not an image'
        })
      }
    })
  })

  // @route GET /image/:filename
  // @desc Download Image
  app.get('/download/:filename/:purpose', (req, res) => {
    console.log('download fired')
    gfs.files.findOne({metadata: {filename: req.params.filename, purpose: req.params.purpose}}, function (err, file) {
      
      if (err) {
          return res.status(400).send(err);
      }
      else if (!file) {
          return res.status(404).send('Error on the database looking for the file.');
      }

      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

      let readstream = gfs.createReadStream({
        filename: file.filename
      });

      readstream.on("error", function(err) { 
          res.end();
      });
      readstream.pipe(res);
    });
  })

  //////////////// Upload image routes //////////////




//////////////// User routes ////////////////
 
  app.post("/api/sendmail", function(req, res) {
    console.log("Sendmail has been fired!");
    
    server.send({
      text:     req.body.message, 
      from:     req.body.email, 
      to:       "Ryan Diaz <ryandiaz@gmail.com>",
      cc:       "Chad Pilker <chad.pilker@gmail.com>, jjmckenzie@carolina.rr.com, matthewgeddes@yahoo.com",     
      subject:  "RecruitHound Contact - Job Seeker",
      attachment:
      [
        {data: '<html>Name: ' + req.body.person_name + '<br />Phone:  ' + req.body.number1 + '<br />Message: ' + req.body.message + '</html>', alternative:true}
      ]
    }, function(err, message) {
        console.log(err || message); 
        if (!err) {   // Sends back status message in the form of an object -> res.status
          res.json({status: "success"});
        } else {
          res.json({status: "error"});
        }
    });
  });

  app.post('/api/signup', (req, res) => {
    console.log("Signup post incoming...");
   
    User.register(new User(
      { 
        username: req.body.username,
        firstname: req.body.newfirstname,
        lastname: req.body.newlastname,
        address1: req.body.newaddress1,
        address2: req.body.newaddress2,
        city: req.body.newcity,
        state: req.body.newstate,
        zip: req.body.newzip,
        password: req.body.password
      }), req.body.password, function(err, account) {
      if (err) {
        console.log("error found in passport-routes.js!");
          console.log(err);
          res.json({err});
      } else {
          console.log('New user added!');
          passport.authenticate('local')(req, res, function() {
            console.log('Done!');
            res.json({username: req.user.username});
          });
        }
      });
    }
  );

  // Update user profile
  app.post('/api/update-user-profile', (req, res) => {
    console.log("Update user post incoming...");
    User.update({_id: mongojs.ObjectID(req.body.id)}, {$set: {   // First update the user profile
      username: req.body.newusername,
      firstname: req.body.newfirstname,
      lastname: req.body.newlastname,
      address1: req.body.newaddress1,
      address2: req.body.newaddress2,
      city: req.body.newcity,
      state: req.body.newstate,
      zip: req.body.newzip,
    }}, 
    function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        User.findOne({_id: mongojs.ObjectID(req.body.id)}, function(error, user) {
          if (req.body.newpassword != null) {   // Second update the password if necessary
            user.setPassword(req.body.newpassword, function(err) {
              if (err) {
                console.log(err);
              } else {
                user.save(function(err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log("User updated!")
                  }
                })
              }
            })
          }
          req.login(user, function(err) {   // Third refresh the session with new email address if changed
            if (err) return next(err)
            res.send({
              id:user._id,
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              address1: user.address1,
              address2: user.address2,
              city: user.city,
              state: user.state,
              zip: user.zip,
              created: user.created,
              lastLogin: user.lastLogin
            })
          })

        })
      }
    });    
  })


  // Search for all recruiters by a given city
  app.get('/recruitersearch', function(req, res){
    console.log('/recruitersearch route fired')
    database.collection("recruiters").find({city1: req.query.city}, function(error, response) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.send({response})
      }
    });
  })

  // Sign in route
  app.post('/api/signin', function(req, res, next) {
    console.log("Signin post incoming...");
    next();
  },
    passport.authenticate('local'),(req, res) => {
      res.json({
        id:req.user._id,
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        address1: req.user.address1,
        address2: req.user.address2,
        city: req.user.city,
        state: req.user.state,
        zip: req.user.zip,
        created: req.user.created,
        lastLogin: req.user.lastLogin
      });
    }
  )
  
  // 
  app.get('/api/getuser', function(req, res) {
    console.log('getuser get has fired')
    database.collection("users").find({username: req.session.passport.user}, function(error, response) {
      if (error) {
        console.log('Error: ', error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.send({
          id: response[0]._id,
          username: response[0].username,
          firstname: response[0].firstname,
          lastname: response[0].lastname,
          address1: response[0].address1,
          address2: response[0].address2,
          city: response[0].city,
          state: response[0].state,
          zip: response[0].zip,
          created: response[0].created,
          lastLogin: response[0].lastLogin
        })
      }
    });
  });


  // Save the recruiter to your database
  app.post('/saverecruiter', function(req, res){
    const newSavedRecruiter = new savedRecruiter(req.body)
    console.log(newSavedRecruiter)

    //NEED TO PASS IN THE the USER ID to UPDATE THE USER THAT IT HAS A SAVED USER
    // db.collection("savedRecruiters").insert(newSavedRecruiter).then(function(savedRecruiter) {
    //   //WE NEED CODE TO PUSH IT TO THE LOGGED IN RECRUITER BY ID AND PUSH TO THAT ARRAY
      
    //   db.collection("users").findOneandUpdate({email})
    //   console.log("complete")
    //   res.send(savedRecruiter.newSavedRecruiter + " added to db")
    })

  app.get("/api/signout", function(req, res) {
    console.log("Signout has been fired!");
    console.log(req.session.passport);
    req.session.destroy(function (err) {
      console.log(req.session.passport);
    });
    

  });

  /////////////////// User routes ///////////////////

};