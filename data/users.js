const bcrypt = require('bcrypt');
const saltRounds = 16;
const mongoCollections = require('../config/mongoCollections');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('../errorHandling');
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');

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

module.exports = {
    signUp,
    login,
    postReview,
    getAllReviews
}