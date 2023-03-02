const  mongoose=require('mongoose')
const Schem=mongoose.Schema;

const userSchem=new Schem({
   
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        },
        match:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }, 
    password:{
        type:String,
        required:true
       
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('User',userSchem)