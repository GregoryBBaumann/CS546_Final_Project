const express = require('express');
const router = express.Router();
const userData = require('../data/user');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge, checkRating } = require('../errorHandling');

router.get('/', async (req, res) => {

    res.render('posts/home');
    
});

router.get('/login', async (req, res) => {
    if(req.session.user){
        let check = await userData.checkUser(req.session.user.username, req.session.user.password);
        if(check.authenticated) res.redirect('/feed');
    }else{
        res.render('posts/login');
    }
});


router.post('/login', async (req, res) => {
    try{
        if(!req.body.username || !req.body.password) throw 'You must provide username and password';
        if (!req.body.username || !req.body.password)  throw 'All fields need to have valid values';
        if (typeof req.body.username !== 'string' || req.body.username.trim().length === 0) throw 'username is not string or empty string';
        if (req.body.username.trim().length < 4) throw 'username less than 4 characters';
        if (typeof req.body.password !== 'string' || req.body.password.trim().length === 0) throw 'password is not string or empty string';
        if (req.body.password.trim().length < 6) throw 'password less than 6 characters';
        let check = await userData.checkUser(req.body.username, req.body.password);
        if(check.authenticated){
            req.session.user = {username: req.body.username, password: req.body.password};
            res.redirect('/feed');
        }else{
            throw 'wrong username or password'
        }
    }catch (e){
        res.status(401).render('posts/login', { error: e });
    }
    
});


router.get('/signup', async (req, res) => {
    if(req.session.user){
        let check = await userData.checkUser(req.session.user.username, req.session.user.password);
        if(check.authenticated) res.redirect('/fedd');
    }else{
        res.render('posts/signup');
    }
});


router.post('/signup', async (req, res) => {
    try{
        if(!req.body.username || !req.body.password) throw 'You must provide username and password';
        if (!req.body.username || !req.body.password)  throw 'All fields need to have valid values';
        if (typeof req.body.username !== 'string' || req.body.username.trim().length === 0) throw 'username is not string or empty string';
        if (req.body.username.trim().length < 4) throw 'username less than 4 characters';
        if (typeof req.body.password !== 'string' || req.body.password.trim().length === 0) throw 'password is not string or empty string';
        if (req.body.password.trim().length < 6) throw 'password less than 6 characters';
        let create = await userData.createUser(req.body.username, req.body.password);
        if(create.userInserted){
            res.redirect('/');
        }else{
            throw 'Internal Server Error';
        }
    }catch (e){
        res.status(401).render('posts/signup', { error: e });
    }
    
});


router.get('/feed', async (req, res) => {
    if(req.session.user){
        let check = await userData.checkUser(req.session.user.username, req.session.user.password);
        if(check.authenticated) res.render('posts/feed', {username: req.session.user.username, password: req.session.user.password});
    }else{
        res.render('posts/login');
    }
});


router.get('/feedThreads', async (req, res) => {
    if(req.session.user){
        let check = await userData.checkUser(req.session.user.username, req.session.user.password);
        if(check.authenticated) res.render('posts/feedThreads', {username: req.session.user.username, password: req.session.user.password});
    }else{
        res.render('posts/login');
    }
});



router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.render('posts/logout');
});


router.get('/review', async (req, res) => {
    res.render('posts/review');
});

router.get('/getallreviews', async(req, res) =>{
    const data = await userData.getAllReviews()
    return res.status(200).json(data);
})

router.post('/postreview', async(req, res) =>{
   /* let data = req.body;
    let {title, category, review, rating} = data;
    data.userID = req.session.user;*/
    // error checking
    try{
       /* title = checkStr(title, "Title");
        category = checkStr(category, "Category");
        review = checkStr(review, "Review");
        rating = checkNum(rating, "Rating");
        checkRating(rating);*/
        await userData.postReview(req.body.title, req.body.category, req.body.rating, req.body.review);
        //return res.status(200).json(result);
    }catch (e){
        return res.status(400).json({error: e});
    }
})


router.get('/threads', async (req, res) => {
    res.render('posts/threads');
});


router.get('/getallthreads', async(req, res) =>{
    const data = await userData.getAllThreads()
    return res.status(200).json(data);
})

router.post('/postthreads', async(req, res) =>{
    try{
        await userData.postThreads(req.body.title, req.body.text);
    }catch (e){
        return res.status(400).json({error: e});
    }
})

module.exports = router;