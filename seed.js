const mongoConnection = require('./config/mongoConnection');
const mongoCollections = require('./config/mongoCollections');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('./errorHandling');
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const threads = mongoCollections.threads;
const { ObjectId } = require('mongodb');
const data = require('./data');

async function main(){
    const db = await mongoConnection.dbConnection();
    db.dropDatabase();
    try {
        const user1 = await data.signUp('Billy','Bob','billy@gmail.com','password','It','HomeVille','NY',30);
        const user1Id = user1._id.toString();
        const user2 = await data.signUp('Jane','Jill','JaneJJill@yahoo.com','catLover69','Female','CreakVill','NJ',21);
        const user2Id = user2._id.toString();
        const user3 = await data.signUp('tester','tested','test@gmail.com','password','Male','medcum','NJ',20);
        const user3Id = user3._id.toString();
        const user4 = await data.signUp('Batman','Robin','waine@wainetech.com','jokerSuks','Male','Gotham','NY',41);
        const user4Id = user4._id.toString();
        const user5 = await data.signUp('Newman','John','nJohn@stevens.eu','drowssap','Duck','HomeVille','AR',33);
        const user5Id = user5._id.toString();
        const user6 = await data.signUp('Runner','Lover','IHeartRunning@yahoo.com','love2run','Runner','RunnersVille','PA',66);
        const user6Id = user6._id.toString();
        let review1 = { title:"X-ARM-Airsprings",
                        category:"Shoes",
                        review:"I can recommend this model to any presective runner",
                        rating: "5",
                        postedDate:"2010/12/25",
                        userID:user1Id};
        review1 = await data.postReview(review1);
        let review2 = { title:"Jorts",
                        category:"Cloths",
                        review:"Who ever made these can suffer",
                        rating: "1",
                        postedDate:"2018/08/01",
                        userID:user4Id};
        review2 = await data.postReview(review2);
        let thread1 = await data.postThread("good running spots","2020/04/20","Where are any good running spots?",0,user6Id);
        let thread2 = await data.postThread("Can't wait for turky trot","2022/04/20","Anyone else excited for turky trot",0,user2Id);
        let comment1 = await data.postThreadComment("I'm really excited",thread2._id.toString(),user5Id);
        let comment2 = await data.postReviewComments(review2._id.toString(),user3Id,"I think you need to rethink you opinion");
    } catch (error) {
        console.log(error);
    }
    console.log("Database sucessfully seeded");
    mongoConnection.closeConnection();
}

main();