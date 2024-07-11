const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3001;

mongoose.connect('mongodb+srv://Sirisha:2zCfraDEi6nK9Gk1@cluster0.epwmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const User = mongoose.model('users', {
    username: String,
    mail: String,
    password: String
});

//Middleware
app.use(bodyParser.json());

//Routes
app.post('/signIn', async(req,res) => {
    const { mail, password } = req.body;

    try {
        const user = await User.findOne({ mail });
        if( !user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        res.send('Login Sucessfully');
    } catch (error) {
        res.status(500).send("Error Signing in")
    }
});

app.post('/signUp', async(req,res) => {
    const { userName, mail, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User ({userName, mail, password: hashedPassword});
        await newUser.save();
        res.status(201).send("User Created Sucessfully");
    } catch (error) {
        res.status(500).send("Error Creating user");
    }
});

app.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`);
});