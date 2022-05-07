function checkStr(str, name){
    if(str === null || str === undefined) throw `${name} not provided`;
    if(typeof str !== 'string') throw `${name} is not a string`;
    str = str.trim();
    if(str.length === 0) throw `${name} is empty`;
    return str;
}

function checkNum(num, name){
    num = checkStr(num);
    if(num.includes('.')) throw `${name} cannot be a a decimal`;
    num = parseInt(num);
    return num;
}

function checkEMail(email){
    if(!email.includes(".") || !email.includes("@")) throw `Invalid Email`;
    let suffix = email.split("@")[1];
    let diff = suffix.split(".")[0].length;
    if(diff < 3) throw `Invalid Email`;
    for(let i of email.split(".")){
        if(i.length < 2) throw `Invalid Email`;
    }
    email = email.toLowerCase();
    return email;
}

function checkPassword(password){
    if(password === null || password === undefined) throw `Password not provided`;
    if(password.length < 6) throw `Password should be at least 6 characters long`;
}

function isPresent(str, name){
    if(str === null || str === undefined) throw `${name} not provided`;
}

function checkAge(age){
    if(age < 13 || age > 120) throw `Invalid Age`;
}

function checkRating(rating){
    if(rating < 0) throw `Rating cannot be less than 0`;
    if(rating > 5) throw `Rating cannot be greater than 5`;
}

module.exports = {
    checkStr,
    checkNum,
    checkEMail,
    checkPassword,
    isPresent,
    checkAge,
    checkRating
}