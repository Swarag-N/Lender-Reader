const express = require('express')
const Book = require('../models/BookModel');
const Lending=require('../models/LendingModel');
const moment = require('moment');
const route = express.Router();

isLoggedinCheck = function ( request,respond,next){
    if(request.isAuthenticated()){
        return next();
    }
    console.log("you reached to add Books without logging in");
    // request.flash("error","Login Required");

    respond.redirect("/login");
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


route.get('/',isLoggedinCheck,(Request,Response)=>{
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
                Response.render("books/book_index",{list:foundBooK, noMatch: noMatch});
                }
            });
        } else {
        Book.find((err,found_books)=>{
            if(err){
                console.log(err);
                Response.send(err);
            }else{
                Response.render('books/book_index',{list:found_books});
            }}).limit(10)}
});

//ADDING NEW BOOKS
route.get("/new",isLoggedinCheck,(Request,Response)=>{
    Response.render("books/book_new")
});


//POSTING NEW BOOKS
route.post("/",isLoggedinCheck,(Request,Response)=>{
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
    })
    Response.redirect("/books");
});

//SHOW BOOKS
route.get("/:id",isLoggedinCheck,(Request,Response)=>{
    console.log("++++++++++++++++++++++++++++++++++++++++++")
    Book.findById(Request.params.id).populate("history").exec(function(err,found_book){
        if(err){
            console.log("Error at Showing Books Retriveing the Book");
            console.log(err);
        }else{
            console.log(found_book)
            Response.render('books/book_show.ejs',{
                book:found_book,
                moment:moment
            })
        }
    })
});


//EDIT BOOKS
route.get("/:id/edit",isLoggedinCheck,(Request,Response)=>{
    console.log("In EDIT of a Sepcific BOOK");
    Book.findById(Request.params.id,(err,found_book)=>{
        if(err){
            console.log("Error In Viewing the Book for EDit");
            console.log(err);
        }else{
            console.log(found_book,"Currently In Edit")
            Response.render("books/book_edit",{book:found_book});
        }
    });
    // Response.render("books/book_edit",{book:Request.params.id});
});

// PUT REquest
route.put("/:id",isLoggedinCheck,(Request,Response)=>{
    console.log("+++++++++++++++++++++++In put++++++++++++++++++")
    console.log(Request.body.Book);
    console.log(Request.params.id)
    console.log("+++++++++++++++++++++++In put++++++++++++++++++")
    // Response.redirect('/books');
    Book.findByIdAndUpdate(Request.params.id,Request.body.Book,(err,updated_book)=>{
        if(err){
            console.log("Error In Updating Book");
        }else{
            console.log("+++++++++++++Updated Book++++++++++++");
            console.log(updated_book);
            Response.redirect("/books/"+Request.params.id);
        }
    });
});


route.delete("/:id",isLoggedinCheck,(Request,Response)=>{
    console.log("in Delete Mode");
    Book.findByIdAndRemove(Request.params.id,(err)=>{
        if(err){
            console.log("Error in deleting a Book");
            console.log(err);
        }else{
            console.log("Delete Sucessfull");
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