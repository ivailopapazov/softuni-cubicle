const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const saltRounds = 10;
const secret = 'alsdkjfaposdl;fgijhsdaklgjfhaskdlfghjasdklfgjh';

exports.register = async ({ username, password, repeatPassword }) => {
    // TODO: return form validation message
    if (password !== repeatPassword) {
        return false;
    }

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let createdUser = User.create({
        username,
        password: hashedPassword,
    });

    // let createdUser = new User({
    //     username,
    //     password: hashedPassword,
    // });

    // createdUser.save();

    return createdUser;
};

exports.login = async ({ username, password }) => {
    let user = await User.findOne({ username });

    if (!user) {
        // TODO: add message
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return;
    }

    let result = new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id, username: user.username }, secret, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                return reject(err);
            }
    
            resolve(token);
        });
    });

    return result;
};