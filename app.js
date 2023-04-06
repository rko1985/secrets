//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const port = 3000;
 
const app = express();
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String 
});

const User = new mongoose.model("User", userSchema);
 
app.get("/", function(req,res){
    res.render('home');
});

app.get("/login", function(req,res){
    res.render('login');
});

app.get("/register", function(req,res){
    res.render('register');
});

app.post("/register", function(req, res){
    try {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });
    
        newUser.save();
        res.render("secrets");
    } catch (err){
        console.log(err);
    }
});

app.post("/login", async function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);
    try {
        const foundUser = await User.findOne({email: username});
        if(foundUser) {
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    } catch (err) {
        console.log(err);
    }
    
})
 
 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});