// server.js
//
// Base Setup
//
//

//  Call the packages we need
//
var express = require('express');
var bodyParser = require('body-parser');
var Message = require('./app/models/message');
var pub = __dirname;
var path = require('path');
var app = express();
//Database configure
//
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/messages');
//Configure the app to use the body parser
//Lets you easily get data from POST
//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Sets the Directory of the views
app.set('views', path.join(__dirname, 'views'));

//Sets the default template engine to Jade
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res,next){
    req.db = db;
    next();
});
var port = process.env.PORT || 3000;    //Sets the port being used
//Routes for API
//
var router = express.Router();  //Starts instance of express router

//Middleware for all requests
//Needs updating to do logging when API is used it will output to console
router.use(function(req, res, next){
    //Logging here
    console.log(req.method, req.url);
    next();
});

//Get

router.get('/', function(req, res){
    res.render('index');
});
router.get('/temp', function(req, res){
    res.render('tempIndex');
});
router.get('/msg', function(req, res){
    res.render('msgIndex');
});

//Routes that end in message

router.route('/messages')

    //Creates a message
    .post(function(req, res){
        var message = new Message();
        message.message_s = req.body.message_s; //Sets the message from the request
        message.date_s = req.body.date_s; //Sets the date from when posted
        message.save(function(err){
            if(err)
                res.send(err);

            res.json({message: 'New Message Created'});
        });
    })
    //Gets all the messages
    .get(function(req, res){
        Message.find(function(err, messages){
            if(err)
                res.send(err);
            res.json(messages);
           // res.render('index', {title:'Message API', Message:messages});
        });
    });

//Routes that end in /messages/:message_id
router.route('/messages/:message_id')

    //gets the message by id
    .get(function(req, res){
        Message.findById(req.params.message_id, function(err, message){
            if (err)
                res.send(err);
            res.json(message);
        });

    })
    //update the Message with given ID
    .put(function(req, res){
        Message.findById(req.params.message_id, function(err, message){
            if (err)
                res.send(err);
            message.message_s = req.body.message_s; //updates the message info
            //Save the message
            message.save(function(err){
                if (err)
                    res.send(err);
                res.json({ message:'Message Updated!'});
            });
        });
    })
    .delete(function(req, res){
        Message.remove({
            _id: req.params.message_id
        }, function(err, message){
            if(err)
                res.send(err);

            res.json({message: 'Message Deleted.'});

        });
    });

router.route('/temperatures')

    //Creates a new temperature data point
    .post(function(req, res){
        var temp = new Temperature();
        message.messagesTableage_s = req.body.message_s; //Sets the message from the request
        message.date_s = req.body.date_s; //Sets the date from when posted
        message.save(function(err){
            if(err)
                res.send(err);

            res.json({message: 'New Message Created'});
        });
    })
    //Gets all the messages
    .get(function(req, res){
        Message.find(function(err, messages){
            if(err)
                res.send(err);
            res.json(messages);
           // res.render('index', {title:'Message API', Message:messages});
        });

//Register our routes
//All routes will use prefix api
app.use('/api', router);

//Starts the server
//
app.listen(port);
console.log('Server started at port ' + port);
