exports.modelValidator = (Model) => async (req, res, next) => {
    try {
        await Model.validate(req.body);

        next();
    } catch (error) {
        console.log(error);
        res.status(400).send(Object.values(error)[0]);
    }
};