const mongoose = require('mongoose'),
    Lending=require('./LendingModel');

const book_Schema = new mongoose.Schema(
    {
        title:String,
        author:String,
        genre:String,
        history:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Lending"
            }
        ]
    }
)

module.exports = mongoose.model("Book",book_Schema);
