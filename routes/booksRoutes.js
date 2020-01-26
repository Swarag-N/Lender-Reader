const express = require('express');
const Book = require('../models/BookModel');
// const Lending=require('../models/LendingModel');
const moment = require('moment');
const route = express.Router();

// Todo Getting Pagination in Category and Start Lending Backend

function isLoggedInCheck( request,respond,next){
    if(request.isAuthenticated()){
        return next();
    }
    console.log("you reached to add Books without logging in");

    respond.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


route.get('/',isLoggedInCheck,(Request,Response)=>{
    console.log(Request.user);
    console.log(Request.query);
    let noMatch = null;
    let page = Request.query.page || 1;
    let perPage = Request.query.results || 6;
    if(Request.query.search) {
        const regex = new RegExp(escapeRegex(Request.query.search), 'gi');
        Book.find({"title": regex}, (err, foundBooK)=>{
            })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, foundBooK) {
                Book.countDocuments().exec(function(err, count) {
                    if (err)
                        return next(err);
                    Response.render('books/book_index', {
                        list: foundBooK,
                        inquiry:Request.query.search,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            });
    }else{
        Book.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                    Book.countDocuments().exec(function(err, count) {
                        if (err)
                            return next(err);
                        Response.render('books/book_index', {
                            list: products,
                            inquiry:"",
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
                })
        }});


//ADDING NEW BOOKS
route.get("/new",isLoggedInCheck,(Request,Response)=>{
    Response.render("books/book_new")
});


//POSTING NEW BOOKS
route.post("/",isLoggedInCheck,(Request,Response)=>{
    console.log("arrived at post");
    console.log(Request.body.Book);
    console.log(Request.user.id,"****************************");
    Book.create(Request.body.Book,(err,new_book)=>{
        if(err){
            console.log("There is a error in posting");
            console.log(err);
        }else{
            console.log(new_book);
        }
    });
    Response.redirect("/books");
});

//SHOW BOOKS
route.get("/:id",isLoggedInCheck,(Request,Response)=>{
    Book.findById(Request.params.id).populate("history").exec(function(err,found_book){
        if(err){
            console.log(err);
        }else{
            console.log(found_book);
            Response.render('books/book_show.ejs',{
                book:found_book,
                moment:moment
            })
        }
    })
});


//EDIT BOOKS
route.get("/:id/edit",isLoggedInCheck,(Request,Response)=>{
    Book.findById(Request.params.id,(err,found_book)=>{
        if(err){
            console.log("Error In Viewing the Book for EDit");
            console.log(err);
        }else{
            console.log(found_book,"Currently In Edit")
            Response.render("books/book_edit",{book:found_book});
        }
    });
});

// PUT Request
route.put("/:id",isLoggedInCheck,(Request,Response)=>{
    Book.findByIdAndUpdate(Request.params.id,Request.body.Book,(err,updated_book)=>{
        if(err){
            console.log("Error In Updating Book",err);
        }else{
            console.log(updated_book);
            Response.redirect("/books/"+Request.params.id);
        }
    });
});


route.delete("/:id",isLoggedInCheck,(Request,Response)=>{
    Book.findByIdAndRemove(Request.params.id,(err)=>{
        if(err){
            console.log("Error in deleting a Book");
            console.log(err);
        }else{
            console.log("Delete Successful");
            Response.redirect("/books")
        }
    })
});

module.exports = route;