const bodyParser = require('body-parser');
var express = require('express');
var app = express();


app.use( function( req, res, next ) {
  console.log(`${req.method} ${req.path } - ${req.ip}`);
  next();
} );


app.use( bodyParser.urlencoded({"extended": false}) );


console.log('Hello World');


app.get('/', function(req, res){ res.sendFile( __dirname + '/views/index.html') } );


app.use( express.static( __dirname + '/public') );

 app.get('/json', function(req, res) { 
  let obj = { "message": "Hello json" };
  if (process.env.MESSAGE_STYLE == 'uppercase')
  {
    obj.message = obj.message.toUpperCase();
  }
  res.json(obj);
});
 

app.get('/now', function( req, res, next ){
                  req.time = new Date().toString();
                  next();
                },
                function(req, res){
                  res.json({ "time": req.time });
                }
       );


app.get( '/:word/echo', function( req, res ){
  res.json({ "echo": req.params.word });  
} );


  
app.route('/name')
  .get( (req, res) => {
    res.json({"name": req.query.first + ' ' + req.query.last});  
  })
  .post( (req, res) => {
    res.json({ "name": req.body.first + ' ' + req.body.last});
  } );



 module.exports = app;