const Joi = require('joi');
const { schema } = require('../models/user');


const registerValidate = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
    
        email:Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .lowercase()
                .required(),
    
        password: Joi.string()
            .min(7)
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
        confirmPassword: Joi.ref('password'),
    
    })
    
    

    
const loginValidate =   Joi.object({
      email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .lowercase()
            .required(),
      password: Joi.string()
            .min(7)
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })


/**
 * @change password
 */
const passwordValidate =   Joi.object({
    old_password: Joi.string()
          .min(7)
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    new_password: Joi.string()
          .min(7)
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  })  
  
  
/**
 * @update profile
 */
const profileValidate =  Joi.object({
    username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
    
    email:Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .lowercase()
                .required(),

  })

module.exports={
    registerValidate,
    loginValidate,
    passwordValidate,
    profileValidate
}
