var mongoose = require('mongoose'),
    Book = require('./BookModel'),
    User =require('./UserModel');

var lending_Schema = new mongoose.Schema({
    reader:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    lendingMaterial:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
    start:Date,
    end:Date
});

module.exports = mongoose.model("Lending",lending_Schema)

// lender:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref:"User"
// },