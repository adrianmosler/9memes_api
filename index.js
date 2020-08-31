
require('./config');
const express = require('express')
const app = express()
const mongoose = require('mongoose');


app.get('/', (req, res) => {
  res.send('Hello World 9memes!')
})


mongoose.connect(process.env.MONGO_ATLAS_URL,
    { useNewUrlParser : true , useCreateIndex : true },
    (err,res) => {
        if(err) throw err;
        else console.log('Bases de datos online')
    }
  );

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
