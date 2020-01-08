const express = require('express');
const Book = require('../models/BookModel');
// const Lending=require('../models/LendingModel');
const moment = require('moment');
const route = express.Router();

function isLoggedInCheck( request,respond,next){
    if(request.isAuthenticated()){
        return next();
    }
    console.log("you reached to add Books without logging in");
    // request.flash("error","Login Required");

    respond.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
//Todo Page Division and getting the value

route.get('/:page',isLoggedInCheck,(Request,Response)=>{
    console.log(Request.user);
    let noMatch = null;
    if(Request.query.search) {
        const regex = new RegExp(escapeRegex(Request.query.search), 'gi');
        Book.find({"title": regex}, function(err, foundBooK){
            if(err){
                console.log(err);
                Response.send(err)
            } else {
                if(foundBooK.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                console.log(foundBooK);
                Response.render("books/book_index",{list:foundBooK, noMatch: noMatch,page:Math.floor(foundBooK.length/10)});
                }
            });
    }else{
        let perPage = 5;
        let page = Request.params.page || 1;

        Book.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                    Book.count().exec(function(err, count) {
                        if (err)
                            return next(err);
                        Response.render('books/book_index', {
                            list: products,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
                })
        }});
//         Book.find((err,found_books)=>{
//             if(err){
//                 console.log(err);
//                 Response.send(err);
//             }else{
//                 Response.render('books/book_index',{list:found_books, page:Math.floor(found_books.length/10)});
//             }})}
//             // .limit(10)}
// });

//ADDING NEW BOOKS
route.get("/new",isLoggedInCheck,(Request,Response)=>{
    Response.render("books/book_new")
});


//POSTING NEW BOOKS
route.post("/",isLoggedInCheck,(Request,Response)=>{
    console.log("arrived at post");
    console.log(Request.body.Book)
    console.log(Request.user.id,"****************************")
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


//Todo Add a Search query Box and Optimize thw working of it  Done ;)
//Todo have page numbers for search

//route.get("/search/:id",isLoggedinCheck,(Request,Response)=>{
//     const searchParameter = new RegExp(escapeRegex(Request.params.id), 'gi');
//     console.log("Search",Request.params.id,typeof (Request.params.id),searchParameter);
//     Book.find({"title":searchParameter },(err, foundBooK)=>{
//         if(err){
//             console.log(err);
//             Response.send(err);
//         }else{
//             console.log(foundBooK);
//             Response.send(foundBooK);
//             // Response.render('books/book_index',{list:foundBooK});
//         }
//     })
//
// });

module.exports = route;