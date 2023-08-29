import Joi from 'joi';

const validateAdmin = function validateCustomer(user: String){

    const schema = Joi.object({
        email: Joi.string().required().trim().lowercase().email(),
        password: Joi.string().required().min(6).max(12)
    });

    const options = {
        abortEarly: false,
        
    }

    return schema.validate(user, options)

};


export default validateAdmin;