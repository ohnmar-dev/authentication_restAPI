const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')
const verifyToken=require('../middleware/verify')




router.post('/login',userController.login)
router.post('/signup',userController.register)
router.post('/createPost',verifyToken,userController.createPost)

// router.delete('/logout',verifyToken,userController.logout)

router.patch('/changePassword/:id',verifyToken,userController.changePassword)

router.post('/forget_password',userController.forgetPassword)
router.post('/reset_password/:token',userController.resetPassword)


// for profile
router.patch('/profile/:id',verifyToken,userController.profile)

module.exports=router