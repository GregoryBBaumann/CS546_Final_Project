const bcrypt = require('bcrypt');
const saltRounds = 16;
const mongoCollections = require('../config/mongoCollections');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('../errorHandling');
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const threads = mongoCollections.threads;
const { ObjectId } = require('mongodb');
const { del } = require('express/lib/application');

function checkID(id){
    if(id === undefined || id === null) throw `ID not present`;
    checkStr(id);
    if(!ObjectId.isValid(id)) throw `Invalid User`;
}

async function getUser(id){
    checkID(id);
    id = id.trim();
    id = ObjectId(id);
    const userCollection = await users();
    userData = await userCollection.findOne({_id: id});
    if(userData === null) throw `Invalid User`;
    return userData;
}


async function signUp(firstName, lastName, email, password, gender, city, state, age){
    // Check inputs
    firstName = checkStr(firstName, "First Name");
    lastName = checkStr(lastName, "Last Name");
    email = checkStr(email, "Email");
    email = checkEMail(email);
    checkPassword(password);
    gender = checkStr(gender, "Gender");
    city = checkStr(city, "City");
    state = checkStr(state, "State");
    checkAge(age);

    // add user to the database
    const userCollection = await users();
    const getEmail = await userCollection.findOne(
        {'email': email}
    );
    if(getEmail) throw `Email already in use`;
    const pass = await bcrypt.hash(password, saltRounds);
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: pass,
        gender: gender,
        city: city,
        state: state,
        age: age,
        friends: new Set([]),
        friendReq: new Set([]),
        friendReqSent: new Set([]),
        userReviews: [],
        userThreads: [],
        userVotes: []
    }
    const res = await userCollection.insertOne(newUser);
    if(!res.acknowledged || !res.insertedId) throw `Could not insert User`;
    const userInfo = await userCollection.findOne({email: email});
    return {authenticated: true, userInserted: true, _id: userInfo._id};
}

async function login(email, password){
    // Check inputs
    email = checkStr(email);
    email = checkEMail(email);
    checkPassword(password);

    // Validate User
    const userCollection = await users();
    const user = await userCollection.findOne({
        email: email
    });
    if(!user) throw `Either the email or password is invalid`;
    const res = await bcrypt.compare(password, user.password);
    if(res === true){
        const userInfo = await userCollection.findOne({email: email});
        return {authenticated: true, _id: userInfo._id};
    }
    else throw `Either the email or password is invalid`;
}

async function postReview(data){
    let {title, category, review, rating} = data;
    title = checkStr(title, "Title");
    category = checkStr(category, "Category");
    review = checkStr(review, "Review");
    rating = checkNum(rating, "Rating");
    checkRating(rating);
    
    const userCollection = await users();
    const user = await userCollection.findOne({_id: ObjectId(data.userID)});
    let name = `${user.firstName} ${user.lastName}`;
    data.name = name;
    const reviewCollection = await reviews();
    let res = await reviewCollection.insertOne(data);
    if(!res.acknowledged || !res.insertedId) throw `Could not insert review`;
    data = await reviewCollection.findOne({_id: res.insertedId});
    
    res = await userCollection.updateOne({_id: ObjectId(data.userID)}, {$push: {userReviews: data}})
    if(!res.acknowledged || !res.modifiedCount) throw `Could not insert review`;
    return data;
}

async function getAllReviews(){
    const reviewCollection = await reviews();
    const data = await reviewCollection.find({}).toArray();
    return data;
}

async function updateUser(updateParams, id){
    const names = {
        firstName: "First Name",
        lastName : "Last Name",
        email: "E-Mail",
        password: "Password",
        gender: "Gender",
        city: "City",
        state: "State",
        age: "Age"
    }
    const userCollection = await users();
    const user = await userCollection.findOne({_id: ObjectId(id)})
    if(user === null) throw `Could not find user. Please try again later.`;
    for(let p in updateParams){
        if(updateParams[p] === user[p]) throw `${names[p]} is same as before. Please enter new ${names[p]}.`;
    }
    let res;
    if(updateParams.email !== undefined){
        res = await userCollection.findOne({email: updateParams.email});
        if(res !== null) throw `E-Mail already in use. Please use a different email.`;
    }
    if(updateParams.password !== undefined){
        res = await bcrypt.compare(updateParams.password, user.password);
        if(res === true) throw `Password is same as old password. Please enter a new password.`;
        updateParams.password = await bcrypt.hash(updateParams.password, saltRounds);
    }
    let name = "";
    if(('firstName' in updateParams) || ('lastName' in updateParams)){
        if('firstName' in updateParams) name += updateParams['firstName'] + " ";
        else name += user['firstName'] + " ";
        if('lastName' in updateParams) name += updateParams['lastName'];
        else name += user['lastName'];
    }
    if(name.length !== 0){
        for(let i of user.userReviews){
            i['name'] = name;
        }
        updateParams.userReviews = user.userReviews;
    }
    res = await userCollection.updateOne({_id: ObjectId(id)}, {$set: updateParams});
    if(!res.acknowledged || !res.modifiedCount) throw `Could not edit personal information. Please try again later.`;
    
    // update reviews
    const reviewCollection = await reviews();
    res = await reviewCollection.findOne({'userID': id});
    if(res !== null) await reviewCollection.updateMany({'userID': id}, {$set: {"name": name}});
}

async function updateFriends(data){
    if(!("friendReqSent" in data)) data["friendReqSent"] = {};
    if(!("friendReq" in data)) data["friendReq"] = {};
    if(!("friends" in data)) data["friends"] = {};
    const userCollection = await users();
    let id = data._id;
    delete data._id;
    const res = await userCollection.updateOne({_id: ObjectId(id)}, {$set: data});
    return res;
}

module.exports = {
    signUp,
    login,
    postReview,
    getAllReviews,
    getUser,
    updateUser,
    updateFriends
}