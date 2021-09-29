import './db';

var Message = mongoose.model('Message', 
                                      {user: String,
                                       message:String,
                                       time: String,
                                       ts: Number
                                      });
exports(Message);