require('dotenv').config()
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {registerValidate, loginValidate,passwordValidate,profileValidate}=require('../validations/user')
const config=require('../config/config')
const nodemailer=require('nodemailer')
const randomstring=require('randomstring')



// for resetPasswordMail

const resetPasswordMail =async(email,token)=>{
    try{
        var transport=nodemailer.createTransport({
            service:"hotmail",
            auth: {
                user: process.env.emailUser, // generated ethereal user
                pass: process.env.emailPassword // generated ethereal password
            }
        })
        await transport.sendMail({
            from:process.env.emailUser,
            to:email,
            subject:'Reset Password',
              html:`
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/userapi/reset_password/${token}">Link</a></p>`
        });
        console.log("email sent successfully")
    }catch(err){
       console.log(err,"email not sent")
    }
}


// for jsonwebtoke

const create_jwt=async(user)=>{
    try{
        var token = await jwt.sign({user}, config.secret_jwt,{expiresIn:'1h'});
        return token;

    }catch(err){
        res.json({message:err.message})
    }
}



// hasspassword using bcrypt
const checkPassword=async(password)=>{

    try{
        const hashPassword=await bcrypt.hash(password, 10,)
            
            return hashPassword;
        
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

// post create

const createPost=async(req,res,next)=>{
    jwt.verify(req.token, config.secret_jwt, (err, userData)=> {
        if(err){
            res.sendStatus(403)
            
        }else {
            
            res.status(200).json({message:"Post create successfully!",userData})
        }
        
      });
}

// post register
const register=async(req,res,next)=>{
    
    
    try{
        
        
        const userData=await User.findOne({email:req.body.email});
        if(userData){
            res.json({message:"E-mail is already exist!"})
        }
        else{
                
                const Validation= await registerValidate.validateAsync(req.body)
                
                    if(req.body.password != req.body.confirmPassword){
                        res.json({message:"Password do not Match!"})
                    }
                    else{
                        
                        const hash=await checkPassword(req.body.password)
                        const user=new User({
                            username:req.body.username,
                            email:req.body.email,
                            password:hash,
                        })
                        const saveUser=await user.save()
                        res.status(200).json({message:"Register Successfully!"})
                        }
                    }
                
        
            }
        catch(err) {
            if(err.isJoi === true){
                res.status(422).json({ message:err.message})
            }
            next(err)
            }
}

// for post login
const login=async(req,res,next)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const Validation= await loginValidate.validateAsync(req.body)
        const user = await User.findOne({ email:email })
        if(user){
            const comparePassword=await bcrypt.compare(password,user.password)
                if(comparePassword){
                        
                        const createToken = await create_jwt(user);
                        const userResult = {
                            
                            username:user.username,
                            email:user.email,
                            password:user.password,
                            token:createToken
                            
                        }
                        // const respone={
                        //     success:true,
                        //     message:"User Datail",
                        //     data:userResult
                        // }
                        res.status(200).json({userResult})
                    }
                    else{
                        res.json({message:" Password do not Match!"})
                    }

             
            }
            else{
                res.json({message:"E-mail does not exit"})
            }
            
        
    }catch(err){
        res.json({message:err.message})
    }
}

const changePassword=async(req,res)=>{
   
    try{
        const user_id=req.params.id;
        
        const user=await User.findOne({_id:user_id})
        if(user){
            const matchPassword = await bcrypt.compare(req.body.old_password,user.password)
            const Validation = await passwordValidate.validateAsync(req.body)
            if(!matchPassword){
                return res.status(400).send("Password not matched!");
            }else{
                const new_password=await checkPassword(req.body.new_password)
                const userData=await User.findByIdAndUpdate({_id:user_id},{$set:{
                password:new_password
            }})
                await user.save()
                res.json({message:"Password is updated",userData})
            }
        }else{
            res.json({message:"User Id not found"})
        }
    }
    catch(err){
        res.json({message:err.message})
    
        
      }
}

const forgetPassword = async(req,res)=>{
    try{
        const userData = await User.findOne({email:req.body.email})

        if(userData){
            const randomString = randomstring.generate();
            const data = await User.updateOne({email:req.body.email},{$set:{
            token:randomString
           }})
           resetPasswordMail(userData.email,randomString)
           res.status(200).json({message:"Please Check inbox in mail and reset your password"})
        }else{
            res.json({message:"E-mail does not exit"})
        }
    }catch(err){
        res.json({message:err.message})
    }
}

const resetPassword=async(req,res)=>{
    try{
        const token =req.params.token;
      const tokenData =  await User.findOne({token:token})
      if(tokenData){
        const hashPassword = await checkPassword(req.body.password)
       const user = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{
            password:hashPassword,
            token:''
        }},{new:true})
        res.status(200).json({message:"User Password has been reset",data:user})
      }else{
        res.json({message:"This link has been expired"})
      }
    }catch(err){
        res.json({message:err.message})
    }

}
// for edit profile
const profile=async(req,res)=>{
    try{
        const user_id=req.params.id;
        const Validation = await profileValidate.validateAsync(req.body)
        const user = await User.findOne({_id:user_id})
        if(!user){
            return res.status(400).json({message:"User cannot found"})
        }else{
                const userData=await User.findByIdAndUpdate({_id:user_id},{$set:{
                username:req.body.username,
                email:req.body.email
            }})
            await user.save()
            res.status(200).json({message:"User Update successfully"})
        }
    }catch(err){
        res.json({message:err.message})
    }
}

module.exports={
    register,
    login,
    createPost,
    changePassword,
    forgetPassword,
    resetPassword,
    profile
}