var mongoose = require('mongoose')
require('dotenv').config()

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
