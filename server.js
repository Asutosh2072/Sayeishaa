const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Use PORT environment variable if available, otherwise default to 3019
const port = process.env.PORT || 3019;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Check if MongoDB URI is defined. If not, display an error
if (!mongoURI) {
    console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1) //Exit the process if you don't have the env variable set
}


// Attempt to connect to the database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connection successful"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); //Exit the process if you cant connect to the database
    });

const userSchema = new mongoose.Schema({
    Name: String,
    Comapny_Name: String,
    Phone_No: String,
    Your_Email: String,
    Your_Msg: String,
    recaptcha_checkbox: String,
});

const Users = mongoose.model("data", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/post', async (req, res) => {
        console.log("Request body:", req.body);
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

    try {
        const user = new Users(userData);
        await user.save();
        console.log("User saved to database:", user);
        res.status(200).send("Form Submission Successful");
    } catch (error) {
         console.error("Error saving user:", error);
        res.status(500).json({ message: "Error saving data to the database", error: error.message  });
    }
});


//Basic Error Handling for other routes, This should go at the end as a fallback
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!', error: err.message })
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});