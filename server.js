require('dotenv').config()

const express = require('express')
const mongoose=require('mongoose')
const UserAPI=require('./api/user')
const bodyParser=require('body-parser')
const helmet=require('helmet')
const cors=require('cors')
const morgan=require('morgan')
const compression=require('compression')
const fs=require('fs')
const path=require('path')
const app=express()




const accessLog = fs.createWriteStream(path.join(__dirname,'access.log'),
{flags:'a'}) 


app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// adding Helmet to enhance your API's security
app.use(helmet())
// parse application/json
app.use(bodyParser.json())

// enabling CORS for all requests
app.use(cors())

// HTTP request logger middleware
app.use(morgan('combined',{stream:accessLog}));

// compress all responses
app.use(compression())


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