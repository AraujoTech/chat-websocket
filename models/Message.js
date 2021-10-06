const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }, 
  time:{
  type:String,
  required: true
  },
  ts:{
    type:Number
  }
});

module.exports = Message = mongoose.model('Message', MessageSchema);

// var Message = mongoose.model('Message', 
//                                       {user: String,
//                                        message:String,
//                                        time: String,
//                                        ts: Number
//                                       });