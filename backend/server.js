const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send('Shopkart is start...')
})

mongoose.connect(process.env.MONGO_DB).
then(() => {
    console.log("DB connected succesfully");

    
app.listen(process.env.PORT || 5000, (error) => {
    if(error) console.log(error);

    console.log("Server is running at", process.env.PORT)
})
}).catch((error) => {
    console.log('error', error)
})