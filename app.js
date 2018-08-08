const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const Content = require('./models/content');
const User = require('./models/user');
const db = require('./credentials');
const app = express();


app.use(bodyParser.json());
app.use(passport.initialize());

console.log('Connected to server...');

mongoose.connect(db.conn, { useNewUrlParser: true })
.then(()=>{
    console.log('Connected to mLab!');
})
.catch(()=>{
    console.log('Connection failed...');
});


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS");
    next();
});

// Get number of the paragraphs
app.get('/getNumOfParagraphs', (req, res, next)=>{
    Content.aggregate([{$project: { count: { $size:"$documents" }}}])
    .then(document=>{
        res.status(200).json(document);
    });

});

// Get a paragraph by index
app.get('/getParagraph/:index', function(req , res){
    let index = req.params.index;
    
    Content.aggregate([{$project: { count: { $size:"$documents" }}}])
    .then(document=>{
        if(index > document[0].count || index <= 0 ){
            res.status(404).send();
        }else{
            Content.find({}, {"documents": { $slice: [index-1, 1] }} )
            .then(document=>{
                res.status(200).json(document);
            });
        }
    });

  });

  // User authentication
  // Return true if email and password are correspond
  app.post('/getUserByEmailPassword', function(req , res){
    console.log('backend: /getUserByEmailPassword was called');

    // user inputs from front-end
    let email = req.body.email;
    let password = req.body.password;
    
    // find if there is an applicable user in the database
    User.findOne(
        {email:email, password:password}, 
        (err, result)=>{
            if (err) throw err;
            if(result===null){                
                res.status(402).json({status: false});
            } else{                
                res.status(200).json({status: true});
            }
        }
    );

  });




module.exports = app;
