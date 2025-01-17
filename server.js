const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3019

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/students')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    Name:String,
    Comapny_Name:String,
    Phone_No:String,
    Your_Email:String,
    Your_Msg:String,
    recaptcha_checkbox:String,

})

const Users = mongoose.model("data",userSchema)

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.post('/post',async (req, res)=>{
    console.log("Request body:", req.body); // ADDED LOGGING
    const { formType, Name, Comapny_Name, Phone_No, Your_Email,  Your_Msg, recaptcha_checkbox } = req.body;

    const userData = {
        Name,
        Your_Email,
        // Comapny_Name,
        Your_Msg,
        recaptcha_checkbox,
    };


        if (formType === "contactPage") {
            // userData.Comapny_Name = null;
            userData.Comapny_Name = Comapny_Name;
            userData.Phone_No = null;
            // userData.subject = subject;
        }else{
            userData.Comapny_Name = Comapny_Name;
            userData.Phone_No = Phone_No;
            // userData.subject = null;
        }
        

    const user = new Users(userData);
    await user.save();
    console.log(user);
    res.send("Form Submission Successful");
})

app.listen(port,()=>{
    console.log("Server Started")
})