const express = require('express');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.json());
// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv:asutoshsahoo072:Asutosh@123@database.icbs2.mongodb.net/?retryWrites=true&w=majority&appName=database";
// const emailUser = process.env.EMAIL_USER;
const emailUser = "asutoshsahoo072@gmail.com";
const emailPass = "Ashrita.@5!";

// Route to handle form submissions
app.post('/api/submitForm', async (req, res) => {
    const formData = req.body;

    // 1. Save data to MongoDB
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("mydatabase");
        await db.collection("contacts").insertOne(formData);
        console.log("form data saved to db");
        
         // 2. Send email (optional - replace with your mail configuration)
         const transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
                 user: "asutoshsahoo072@gmail.com",
                 pass: "Ashrita.@5!",
             },
         });

         const mailOptions = {
           from: emailUser,
           to: 'asutoshsahoo072@gmail.com', // Replace with your email address
           subject: 'New Contact Form Submission',
           text: `New Contact Form Submission:\n\nName: ${formData.name}\nCompany Name: ${formData.companyName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
         };
         await transporter.sendMail(mailOptions);
         console.log("email sent")
          res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
         console.error("Error submitting form:", error);
         res.status(500).json({ error: 'Failed to submit form.' });
    } finally {
        await client.close();
    }
});


// Case Study data fetch example
app.get('/api/case-studies', async(req,res)=>{
   const client = new MongoClient(uri);
   try {
      await client.connect();
      const db = client.db('mydatabase');
      const caseStudies = await db.collection('case-studies').find().toArray();
      res.status(200).json(caseStudies)
   } catch (error) {
      console.error("Error fetching case studies: ", error);
      res.status(500).json({ error: "Failed to fetch case studies"});
   } finally {
     await client.close();
   }
})


app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});