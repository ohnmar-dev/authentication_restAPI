const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')

router.post('/login',userController.login)
router.post('/signup',userController.register)
// router.post('/signup',async(req,res,next)=>{
//     const username=req.body.username;
//     const email=req.body.email;
//     const password=req.body.password;
//     const confirmPassword=req.body.confirmPassword;
//     const result=await userSchema.validateAsync(req.body)
    
//     if(password !=confirmPassword){
//         res.json({message:'Password do not Match!'})
//     }
//     else{
//         bcrypt.hash(password, 10,async (err, hash)=> {
           
//             if(err){
//                 return res.json({
//                     message:'Something Worg, Try again!',
//                     error:err
//                 })
//             }
//             else{
//                 const user= new User({
//                     username:username,
//                     email:email,
//                     password:hash
//                 })
//                 try{
//                     const User=await user.save()
//                     res.status(200).json({message:"User Register Successfully"})
//                 }catch(err){
//                     res.status(500).json({message:err.message})
//                 }
    
//             }
            
//         });

//     }
// })

module.exports=router