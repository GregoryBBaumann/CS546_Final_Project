const mongoCollections = require('./config/mongoCollections');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('./errorHandling');
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const threads = mongoCollections.threads;
const { ObjectId } = require('mongodb');
const data = require('./data');
const mongoConnection = require('./config/mongoConnection');

async function main(){
    const user1 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
    const user1Id = user1._id.toString();
    const user2 = await data.signUp('Jane','Jill','JaneJJill@yahoo.com','catLover69','Female','CreakVill','NJ',21);
    const user2Id = user1._id.toString();
    const user3 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
    const user3Id = user1._id.toString();
    const user4 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
    const user4Id = user1._id.toString();
    const user5 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
    const user5Id = user1._id.toString();
    const user6 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
    const user6Id = user1._id.toString();
}

async function clearDB(){
    let id;
    reviewArr = await data.getAllReviews();
    for(const i in reviewArr){
        id = reviewArr[i]['_id'].toString();
        const reviewCollection = await reviews();
        let reviewId = await reviewCollection.deleteOne({_id: ObjectId(id)});
        if(reviewId.deletedCount === 0) throw `No id: ${id}`;
    }
    threadArr = await data.getAllThreads();
    for(const i in threadArr){
        id = threadArr[i]['_id'].toString();
        const threadCollection = await threads();
        let threadId = await threadCollection.deleteOne({_id: ObjectId(id)});
        if(threadId.deletedCount === 0) throw `No id: ${id}`;
    }
    userArr = await data.getAllUsers();
    for(const i in userArr){
        id = userArr[i]['_id'].toString();
        const userCollection = await users();
        let userId = await userCollection.deleteOne({_id: ObjectId(id)});
        if(userId.deletedCount === 0) throw `No id: ${id}`;
    }
    mongoConnection.closeConnection();
}



main();