const faker = require('faker'),
    mongoose = require('mongoose'),
    book = require('./models/BookModel');

mongoose.connect('mongodb://localhost:27017/learn',{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

for(i=0;i<10;i++){
    var new_book={
        title:faker.random.words(),
        author:faker.name.findName(),
        genre:faker.random.word()
    };

    book.create(new_book,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log(new_book);
        }
    })


    // var new_author = {
    //     name:faker.name.findName(),
    //     pinCode:Number(faker.address.zipCode().slice(0,5))
    // }

    // user.create(new_author,(err)=>{
    //     if(err){
    //         console.log(err);
    //         console.log("Creating Error");
    //     }else{
    //         console.log(new_author);
    //     }
    // })

    // console.log(new_author);
}



// var new_book = {
//     title:"OOPS",
//     author:"James",
//     genre:"Education"
// }

// book.create(new_book,(err)=>{
//     if (err){
//         console.log(err);
//     }else{
//         console.log("Successful Book created");
//     }
// })


// var new_user ={
//     name:'Kernal',
//     pincode:327645
// }

// user.create(new_user,(err)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log(new_user,"Successful");
//     }
// })




