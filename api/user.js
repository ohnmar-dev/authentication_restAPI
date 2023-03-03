const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')
const verifyToken=require('../middleware/verify')
const config=require('../config/config')

router.post('/login',userController.login)
router.post('/signup',userController.register)
router.post('/createPost',verifyToken,userController.createPost)


module.exports=router