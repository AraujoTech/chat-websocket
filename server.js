require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

var dbUrl = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_CLUSTER +'/'+process.env.DB_NAME +'?retryWrites=true&w=majority';

//Conexão com o banco de dados

mongoose.connect(dbUrl,(err)=> {
  console.log('mongodb connected', err)
  });


//Definição do Modelo da Mensagem
var Message = mongoose.model('Message', 
                                      {user: String,
                                       message:String,
                                       time: String,
                                       ts: Number
                                      });
/* 
Message.countDocuments({}, function (err, count) {
  var messageSkip = 0;
  if((count - 17) <=17){
    messageSkip = 17;
  } else{
    messageSkip = count-17;
  }
}); */


//Configuração do Socket i.o
io.on('connection',socket=>{
  console.log('a user is connected');

  Message.countDocuments({}, function (err, count) {
    var limits = Math.round(count*0.6);
    var messageSkip = count-limits; 
       if(messageSkip>=100){
         limits=100;
        }
      
    console.log("O valor de count é %d e o de limits é %d, %d deixaram de ser exibidas",count,limits,messageSkip);
  
//capturando as mensagens do BD
   Message.find({}).sort({_id:1}).limit(limits).skip(messageSkip).exec(function (err,messages){
      socket.emit('previousMessage',messages)
      //console.log(messages);
    });
  });


  socket.on('sendMessage',data => {
    console.log(data);
    var message = new Message(data);
    message.save();
    socket.broadcast.emit('receivedMessage',data);
  });
})



server.listen(3000);
//mongoose.connection.dropCollection('messages');