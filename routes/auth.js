const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_sec = process.env.JWT_SECRET;
const requireLogin = require('../middleware/requireLogin')



router.post('/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(409).json({ error: "A user with that email already exists" });
            }

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Internal server error" });
                    }
                    const user = new User({
                        email,
                        password: hash,
                        name,
                    });

                    user.save()
                        .then(() => {
                            res.status(201).json({ message: "User created successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: "Internal server error" });
                        });
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        });
});

router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, jwt_sec)
                        const { _id, name, email } = savedUser
                        res.json({ token, user: { _id, name, email } })
                        console.log(`This is the JWT Token : ${token}`)
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or Password" })
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: "Internal server error" });

                })

        });

})


module.exports = router;