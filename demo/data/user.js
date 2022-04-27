const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const threads = mongoCollections.threads;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 6;
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('../errorHandling');



async function createUser(username, password) {
    if (!username || !password)  throw 'All fields need to have valid values';
    if (typeof username !== 'string' || username.trim().length === 0) throw 'username is not string or empty string';
    if (username.trim().length < 4) throw 'username less than 4 characters';
    if (typeof password !== 'string' || password.trim().length === 0) throw 'password is not string or empty string';
    if (password.trim().length < 6) throw 'password less than 6 characters';
    username = username.toLowerCase();
    const usersCollection = await users();
    const user = await usersCollection.findOne({username: username});
    if (user) throw 'username exist';
    const hash = await bcrypt.hash(password, saltRounds);
    let newUser = {
        username: username,
        password: hash
    }
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    return {userInserted: true};
}

async function checkUser(username, password){
    if (!username || !password)  throw 'All fields need to have valid values';
    if (typeof username !== 'string' || username.trim().length === 0) throw 'username is not string or empty string';
    if (username.trim().length < 4) throw 'username less than 4 characters';
    if (typeof password !== 'string' || password.trim().length === 0) throw 'password is not string or empty string';
    if (password.trim().length < 6) throw 'password less than 6 characters';
    username = username.toLowerCase();
    const usersCollection = await users();
    const user = await usersCollection.findOne({username: username});
    if (!user) throw 'Either the username or password is invalid';
    let comparePass = user.password;
    let compareResult = await bcrypt.compare(password, comparePass);
    if(!compareResult) throw 'Either the username or password is invalid';
    return {authenticated: true};
}


async function postReview(title, category, rating, review){
   /* let {title, category, review, rating} = data;
    title = checkStr(title, "Title");
    category = checkStr(category, "Category");
    review = checkStr(review, "Review");
    rating = checkNum(rating, "Rating");
    checkRating(rating);*/
    
    const reviewCollection = await reviews();
    let newReview = {
        title: title,
        category: category,
        rating: rating,
        review: review
    }
    const insertInfo = await reviewCollection.insertOne(newReview);
    if(!insertInfo.acknowledged || !insertInfo.insertedId) throw `Could not insert review`;
    data = await reviewCollection.findOne({_id: insertInfo.insertedId});
    return data;
}

async function getAllReviews(){
    const reviewCollection = await reviews();
    const data = await reviewCollection.find({}).toArray();
    return data;
}

async function postThreads(title, text){
     const threadsCollection = await threads();
     let newThreads = {
         title: title,
         text: text
     }
     const insertInfo = await threadsCollection.insertOne(newThreads);
     if(!insertInfo.acknowledged || !insertInfo.insertedId) throw `Could not insert threads`;
     data = await threadsCollection.findOne({_id: insertInfo.insertedId});
     return data;
 }
 
 async function getAllThreads(){
     const threadsCollection = await threads();
     const data = await threadsCollection.find({}).toArray();
     return data;
 }


module.exports = {checkUser, createUser, getAllReviews, postReview, getAllThreads, postThreads};