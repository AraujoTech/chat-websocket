require('dotenv').config()
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)

var app = express()


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


//declaração da url de conexão com o banco de dados utilizando variáveis de ambiente
var dbUrl = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_CLUSTER +'/'+process.env.DB_NAME +'?retryWrites=true&w=majority'

//Conexão com o banco de dados
mongoose.connect(dbUrl,(err)=> {
  console.log('mongodb connected', err)
});

//Definição do Modelo da Mensagem
var Message = mongoose.model('Message', 
                                      {name: String,
                                       message:String,
                                       time: String,
                                       ts: Number
                                      })

//ROTAS

//capturando mensagens do usuário no BD
app.get('/messages',(req,res)=>{
  Message.find({},(err,messages)=>{
    res.send(messages);
  })
})

//enviando mensagens do usuário para o BD

app.post('/messages',(req,res)=>{
  var message = new Message(req.body);
  message.save((err)=>{
    if(err)
      sendStatus(500);
    io.emit('message',req.body);
    res.sendStatus(200);
  })  
})

//Configuração do Socket i.o
io.on('connection',()=>{
  console.log('a user is connected')
})

var server= app.listen(3000, () => {console.log('server is running on port ', server.address().port)})
