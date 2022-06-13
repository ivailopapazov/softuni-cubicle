const { isEmail } = require('../utils/validators');

exports.isEmail = (req, res, next) => {
    if (!isEmail(req.body.username)) {
        return res.status(404).send('Invalid email');
    }

    next();
}