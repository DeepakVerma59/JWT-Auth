const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
app.use(cors())
//schema
require('./models/user')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//router
app.use(require('./routes/auth'))
const mongoose = require('mongoose')
const dotenv = require('dotenv')
require('dotenv').config()
const PORT = process.env.PORT || 4000
const requireLogin = require('./middleware/requireLogin');



//CONNECTING TO MONGODB
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/User")
mongoose.connection.on('connected', () => {
    console.log('connected to mongoDb');
})
mongoose.connection.on('eroor', (err) => {
    console.log('error connecting ', err);
})

//listening to SERVER
app.listen(PORT, () => {
    console.log('server is running on', PORT);
})

