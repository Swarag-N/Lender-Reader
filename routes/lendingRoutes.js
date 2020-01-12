const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const Lending = require("../models/LendingModel");
const Book = require("../models/BookModel");
const User = require("../models/UserModel");

const isLoggedinCheck = function (request, respond, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    console.log("you reached to add Books without logging");
    respond.redirect("/login");
};

route.get("/",(request,response)=>{
    response.send("Hello User");
});

route.get('/:bookID',(Request,Response)=>{
    Book.findById(Request.params.bookID,(err,foundBook)=>{
        if (err){
            console.log(err)
        }else{
            console.log(foundBook,Request.User)
            Response.send(foundBook)
        }
    })
});

route.post('/:bookID',isLoggedinCheck,(Request,Response)=>{
    Book.findById(Request.params.bookID,(err,foundBook)=>{
        if(err){
            console.log(err);
        }else{
            var lender = {
                reader : Request.user._id,
                start : Request.body.start,
                end : Request.body.end
            };
            Lending.create(lender,(err,createdLending)=>{
                if(err){
                    console.log("Error Creating Lending Operation");
                    console.log(err)
                }else{
                    foundBook.history.push(createdLending);
                    foundBook.save();
                    console.log(createdLending)
                }
            })
            Response.redirect("/books/"+Request.params.bookID)
        }
    })
});
module.exports = route;