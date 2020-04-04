const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const methodOveride =require("method-override");
const passport = require('passport');
const momnet = require('moment');
const LocalStrategy = require('passport-local');
const logger = require('morgan');
const apk = express();

//models
const Book = require("./models/BookModel");
const User = require("./models/UserModel");
const Lending = require('./models/LendingModel');

//importing Routes
const adminRoutes = require('./routes/adminRoute');
const bookRoutes = require('./routes/booksRoutes');
const lendingRoutes = require('./routes/lendingRoutes');

//Using EJS
apk.set("view engine","ejs");

//admin-bro dependency
apk.use('/admin',adminRoutes);

//For POST 
apk.use(bodyParser.urlencoded({ extended: true }));
apk.use(bodyParser.json());

// For PUT and Delete
apk.use(methodOveride('_method'));


//connect DB
mongoose.connect('mongodb://localhost:27017/learn',{
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{console.log("Databse Connected")});

//for  deprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify`
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//Session
apk.use(require("express-session")({
    secret:"I have to complete this by today",
    saveUninitialized:false,
    resave:false,
}));
apk.use(logger('dev'));
// Passport Config
apk.use(passport.initialize());
apk.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



apk.get("/",(Request,Response)=>{
    console.log("home route")
    Response.send("HomePage");
});

apk.get("/users",(Request,Response)=>{
    Response.render("user");
});

apk.get('/register',(request,Response)=>{
    Response.render('register');
});

apk.post("/register",(request,respond)=> {
    const newUser1 = new User({username: request.body.username, pinCode: request.body.pincode});
    User.register(newUser1, request.body.password, (err, createdUser) => {
        if (err) {
            console.log(err.message);
            return respond.send(err.message)
        }
        passport.authenticate(`local`)(request, respond, () => {
            respond.render("login")
        });
    });
});

apk.get('/login',(request,Response)=>{
    Response.render('login');
});

apk.post("/login",passport.authenticate("local",{
    successRedirect:"/books",
    failureRedirect:"/login"}),(request,respond)=>{});



//Showing all Books INDEX
apk.use("/books", bookRoutes);

//lending Property
apk.use("/lending",lendingRoutes);


apk.get("*",(Request,Response)=>{
    Response.send("Not Available in Your Country");
});


apk.listen(1234,()=>console.log("My new App started"));