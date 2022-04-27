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
        if(e === "Either the email or password is invalid") return res.status(400).render('render/login', {class: "error", msg: e});
        return res.status(500).json({error: "Internal Server Error"});
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
        if(e === "Email already in use") return res.status(400).render('render/signup', {class: "error", msg: e});
        return res.status(500).json({error: "Internal Server Error"});
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
})

router.get('/getallreviews', async(req, res) =>{
    const data = await users.getAllReviews()
    return res.status(200).json(data);
})

module.exports = router;