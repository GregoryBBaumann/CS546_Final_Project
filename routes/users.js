const express = require('express');
const router = express.Router();
const users = require('../data');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('../errorHandling');

router.get('/', async(req, res) =>{
    if(req.session.user){
        res.redirect('/feed');
    }
    else{
        res.render('render/home', {});
    }
})

router.get('/login', async(req, res) =>{
    if(req.session.user){
        res.redirect('/feed');
    }
    else{
        res.render('render/login', {})
    }
})

router.post('/login', async(req, res) =>{
    let {email, password} = req.body;
    try{
        email = checkStr(email, "Email");
        email = checkEMail(email);
        isPresent(password);
    }catch (e){
        return res.status(400).render('render/login', {class: "error", msg: e});
    }
    try{
        const result = await users.login(email, password);
        if(result.authenticated === true){
            req.session.user = result._id;
            res.redirect('/feed');
        }
    }catch (e){
        return res.status(400).render('render/login', {class: "error", msg: e});
    }
})

router.get('/signup', async(req, res) =>{
    if(req.session.user){
        res.redirect('/feed');
    }
    else{
        res.render('render/signup', {})
    }
})

router.post('/signup', async(req, res) =>{
    if(req.session.user){
        return res.redirect('/');
    }
    let {firstName, lastName, email, password, confirmPassword, gender, city, state, age} = req.body;
    try{
        firstName = checkStr(firstName, "First Name");
        lastName = checkStr(lastName, "Last Name");
        email = checkStr(email, "Email");
        email = checkEMail(email);
        isPresent(password, "Password");
        isPresent(confirmPassword, "Password");
        if(password !== confirmPassword) return res.status(400).render('render/signup', {class: "error", msg: "Passwords do not match"});
        checkPassword(password);
        gender = checkStr(gender, "Gender");
        city = checkStr(city, "City");
        state = checkStr(state, "State");
        age = checkNum(age, "Age");
        checkAge(age);
    }catch (e){
        return res.status(400).render('render/signup', {class: "error", msg: e});
    }
    try{
        const result = await users.signUp(firstName, lastName, email, password, gender, city, state, age);
        if(result.userInserted === true){
            req.session.user = result._id;
            res.redirect('/feed');
        }
    }catch (e){
        return res.status(400).render('render/signup', {class: "error", msg: e});
    }
})

router.get('/feed', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        res.render('render/feed', {});
    };
})

router.get('/logout', async(req, res) =>{
    req.session.destroy();
    res.redirect('/');
})

router.post('/postreview', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        let data = req.body;
        let {title, category, review, rating} = data;
        data.userID = req.session.user;
        // error checking
        try{
            title = checkStr(title, "Title");
            category = checkStr(category, "Category");
            review = checkStr(review, "Review");
            rating = checkNum(rating, "Rating");
            checkRating(rating);
            const result = await users.postReview(data);
            return res.status(200).json(result);
        }catch (e){
            return res.status(400).json({error: e});
        }
    }
})

router.get('/getallreviews', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        const data = await users.getAllReviews()
        return res.status(200).json(data);
    }
})

router.get('/review/:idNumber', async(req, res) => {
    let reviewPost = await users.getReviews(req.params.idNumber);
    const title = reviewPost.name;
    reviewPost.postedDate = new Date(reviewPost.postedDate).toLocaleString('English', { hour12: false });
    //let userId = ObjectId(req.session.user.userid).toString();
    res.render('render/review', { title: title, post: reviewPost, postId: req.params.idNumber});
});


router.get('/userinfo/*', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        try{
        const id = req.params['0'];
        const data = await users.getUser(id);
        const currUserData = await users.getUser(req.session.user);
        const userInfo = {
            data: data,
            currUser: currUserData
        };
        res.render('render/userInfo', userInfo);
        }catch(e){
            return res.status(400).json({error: e});
        }
    }
})

router.post('/userinfo/*', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        try{
        const id = req.params['0'];
        const data = await users.getUser(id);
        const currUserData = await users.getUser(req.session.user);
        const userInfo = {
            data: data,
            currUser: currUserData
        };
        return res.status(200).json(userInfo);
        }catch(e){
            return res.status(400).json({error: e});
        }
    }
})

router.get('/editprofile', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        res.render('render/editProfile', {});
    }
})

router.post('/editprofile', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }

    let {firstName, lastName, email, password, confirmPassword, gender, city, state, age} = req.body;
    let updateParams = {};
    try{
        if(firstName.length !== 0){
            firstName = checkStr(firstName, "First Name");
            updateParams.firstName = firstName;
        }
        if(lastName.length !== 0){
            lastName = checkStr(lastName, "Last Name");
            updateParams.lastName = lastName;
        }
        if(email.length !== 0){
            email = checkStr(email, "Email");
            email = checkEMail(email);
            updateParams.email = email;
        }
        if(password.length !== 0){
            isPresent(password, "Password");
            isPresent(confirmPassword, "Password");
            if(password !== confirmPassword) return res.status(400).render('render/editProfile', {class: "error", msg: "Passwords do not match"});
            checkPassword(password);
            updateParams.password = password;
        }
        if(gender.length !== 0){
            gender = checkStr(gender, "Gender");
            updateParams.gender = gender;
        }
        if(city.length !== 0){
            city = checkStr(city, "City");
            updateParams.city = city;
        }
        if(state.length !== 0){
            state = checkStr(state, "State");
            updateParams.state = state;
        }
        if(age.length !== 0){
            age = checkNum(age, "Age");
            checkAge(age);
            updateParams.age = age;
        }
        if(Object.keys(updateParams).length === 0) return res.status(400).render('render/editProfile', {class: "error", msg: "Nothing to update."});
        let result = await users.updateUser(updateParams, req.session.user);
        return res.status(200).render('render/editprofile', {msg: "Successfully updated personal information."})
    }catch (e){
        return res.status(400).render('render/editProfile', {class: "error", msg: e});
    }
    
})


router.get('/myprofile', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        return res.redirect(`/userinfo/${req.session.user}`);
    }
})


router.post('/updatefriends', async(req, res) =>{
    if(!req.session.user){
        return res.status(401);
    }
    else{
        let result = await users.updateFriends(req.body);
        if(!(result.acknowledged) || !(result.modifiedCount)) return res.status(500).json("Server Error");
        return res.status(200).json("Success");
    }
})

router.get('/friendrequests', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        res.render('render/friendRequests', {currUser: req.session.user});
    }
})

router.get('/threads', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        threadLs = await users.getAllThreads();
        res.render('render/thread',{threadList: threadLs});
    };
})

router.get('/myfriends', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        res.render('render/myFriends', {currUser: req.session.user});
    }
})

router.post('/threads', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else {

        let data = req.body;
        userID = req.session.user;
        // error checking
        try{
            let title = checkStr(data.title, "Title");
            let text = checkStr(data.text, "Text");
            const d = new Date();
            let day = `${d.getDate()+1}`;
            if(day < 10) day = "0".concat(day);
            let month = `${d.getMonth()+1}`;
            if(month < 10) month = "0".concat(month);
            let date = `${d.getFullYear()}/${month}/${day}`;
            const result = await users.postThread(title,date,text,0,userID);
            threadLs = await users.getAllThreads();
            return res.status(200).render('render/thread',{threadList: threadLs});
        }catch (e){
            return res.status(400).render('render/thread',{threadList: threadLs, error: e});
        }
    }
})

router.get('/thread/:title', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        try{
            let title = checkStr(req.params.title);
            let thread = await users.getThreadTitle(title);
            return res.status(200).render('render/threadTitle',thread);
        }catch (e){
            return res.status(400).json({error: e});
        }
    }
})

router.post('/thread/:title/comment', async(req, res) =>{
    if(!req.session.user){
        return res.redirect('/');
    }
    else{
        try{
            let title = checkStr(req.params.title);
            let thread = await users.getThreadTitle(title);
            return res.status(200).render('render/threadTitle',thread);
        }catch (e){
            return res.status(400).json({error: e});
        }
    }
})

module.exports = router;