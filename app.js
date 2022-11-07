//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
const mongoose = require("mongoose");

main().catch(err => console.log(err));
async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
};


const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});
const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
        console.log(foundUser.password);
      }
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, function(){
  console.log("server runs on port 3000");
})
