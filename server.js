require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors')
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://ec2-34-232-62-166.compute-1.amazonaws.com",
    methods: ["GET", "POST"]
  }
});

var allowlist = ["https://ec2-34-232-62-166.compute-1.amazonaws.com", "http://ec2-34-232-62-166.compute-1.amazonaws.com"]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}



app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())


var dbUrl = process.env.DB_CONNECTION;

mongoose.connect(dbUrl,(err)=> {
    console.log('mongodb connected', err)
});

var Message = mongoose.model('Message', 
                                      {user: String,
                                       message:String,
                                       time: String,
                                       ts: Number
                                      });

//Configuração do Socket i.o
io.on('connection',socket=>{
  console.log('a user is connected');
  
  Message.countDocuments({}, function (err, count) {
    var limits = Math.round(count*0.6);
    var messageSkip = count-limits; 
    if (count<50)   {
      messageSkip=0;
      limits = count;
      if(count>=100){
          limits=100;
          messageSkip = count-limits;
          }
      }  
    console.log("O valor de count é %d e o de limits é %d, %d deixaram de ser exibidas",count,limits,messageSkip);
  
//capturando as mensagens do BD
   Message.find({}).sort({_id:1}).limit(limits).skip(messageSkip).exec(function (err,messages){
      socket.emit('previousMessage',messages)
      
    });
  });

  socket.on('sendMessage',data => {
    console.log(data);
    var message = new Message(data);
    message.save();
    socket.broadcast.emit('receivedMessage',data);
  });
});



app.listen(3000);
server.listen(3000);
