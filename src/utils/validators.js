const validator = require('validator');

exports.isEmail = (email) => {
    return validator.isEmail(email);
}