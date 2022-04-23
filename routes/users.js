const express = require('express');
const router = express.Router();
const users = require('../data');
const { checkStr, checkEMail, checkNum, checkPassword, isPresent, checkAge } = require('../errorHandling');

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
            req.session.user = email;
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
            req.session.user = email;
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

module.exports = router;