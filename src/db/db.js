require('dotenv').config();

const mongoose = require('mongoose')

const dbURI = process.env.MONGO

mongoose 
 .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));