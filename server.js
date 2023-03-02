require('dotenv').config()

const express = require('express')
const mongoose=require('mongoose')
const UserAPI=require('./api/user')
const bodyParser=require('body-parser')
const app=express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json())
app.use('/userapi/',UserAPI)

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser:true
    })
const db=mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log('Connect to Mongodb Database'))




app.listen(process.env.PORT || 3000,()=>
    console.log("Servering Connect")
)