import Joi from 'joi';

const validate = function validateCustomer(user: String){

    const schema = Joi.object({
        userName: Joi.string().required().min(6).max(12),
        email: Joi.string().required().trim().lowercase().email(),
        password: Joi.string().required().min(6).max(12),
        phoneNumber: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
        address: Joi.string().required(),
        altAddress: Joi.string().required(),
    });

    const options = {
        abortEarly: false,
        
    }

    return schema.validate(user, options)

};


export default validate;