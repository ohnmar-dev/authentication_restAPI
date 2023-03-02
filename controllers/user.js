const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {userSchema}=require('../validations/user')
const config=require('../config/config')


// for jsonwebtoke

const create_jwt=async(id)=>{
    try{
        var token = await jwt.sign({ _id:id }, config.secret_jwt);
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
// post register
const register=async(req,res,next)=>{
    
    
    try{
        
        
        const userData=await User.findOne({email:req.body.email});
        if(userData){
            res.json({message:"E-mail is already exist!"})
        }
        else{
                const validate = await userSchema.validateAsync(req.body)
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

        const user = await User.findOne({ email:email })
        if(user){
            const comparePassword=await bcrypt.compare(password,user.password)
                if(comparePassword){
                    const createToken = await create_jwt(user._id);
                    const userResult = {
                        _id:user._id,
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
                    res.json({message:"Compare Password do not Match!"})
                }
            }
            else{
                res.json({message:"E-mail does not exit"})
            }
        
    }catch(err){
        res.json({message:err.message})
    }
}

module.exports={
    register,
    login
}