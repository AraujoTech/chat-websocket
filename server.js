require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const socket = require('socket.io-client')('http://localhost:3000')



app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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

//Configuração do Socket i.o
io.on('connection',socket=>{
  console.log('a user is connected');
//capturando as mensagens do 
  Message.find({}).sort({_id:1}).limit(17).exec(function (err,messages){
    socket.emit('previousMessage',messages)
  });

  socket.on('sendMessage',data => {
    console.log(data);
    //messages.push(data);
    var message = new Message(data);
    message.save();
    socket.broadcast.emit('receivedMessage',data);
  });
})



server.listen(3000);
//mongoose.connection.dropCollection('messages')