const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Content = require('./models/content');
const db = require('./credentials');



mongoose.connect(db.conn, { useNewUrlParser: true })
.then(()=>{
    console.log('Connected to mLab!');
})
.catch(()=>{
    console.log('Connection failed...');
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS");
    next();
});

// Get paragraphs
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

module.exports = app;
