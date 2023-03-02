const Joi = require('joi');

const userSchema = Joi.object({
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
   
module.exports={
    userSchema
}