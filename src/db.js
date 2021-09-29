require('dotenv').config();
require('./model.mjs');
const mongoose = require('mongoose');


var dbUrl = process.env.DB_CONNECTION;

mongoose.connect(dbUrl,(err)=> {
    console.log('mongodb connected', err)
});

export function setMessage(message){
    return new Message(message);
}