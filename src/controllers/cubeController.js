const router = require('express').Router();
const {body, validationResult} = require('express-validator');

const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post(
    '/create',
    isAuth,
    body('name', 'Name is required!').not().isEmpty(),
    body('description').isLength({min: 5, max: 120}),
    body('difficultyLevel', 'Difficulty Level is required to be in range 1 to 6').toInt().isInt({min: 1, max: 6}),
    async (req, res) => {
        const cube = req.body;

        cube.owner = req.user._id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).send(errors.array()[0].msg);
        }

        // Validate
        if (cube.name.length < 2) {
            return res.status(400).send('Invalid request');
        }

        // Save data
        try {
            await cubeService.create(cube);

            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
);

router.get('/details/:id', async (req, res) => {
    const cube = await cubeService.getOneDetails(req.params.id).lean();
    const isOwner = cube.owner == req.user?._id;

    res.render('details', { cube, isOwner });
});

router.get('/:cubeId/attach-accessory', async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean();
    const accessories = await accessoryService.getAllAvailable(cube.accessories).lean();

    res.render('accessory/attach', { cube, accessories });
});

router.post('/:cubeId/attach-accessory', async (req, res) => {
    const accessoryId = req.body.accessory;

    await cubeService.attachAccessory(req.params.cubeId, accessoryId);

    res.redirect(`/cube/details/${req.params.cubeId}`);
});

router.get('/:cubeId/edit', isAuth, async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean()

    if (cube.owner != req.user._id) {
        // TODO Add message
        return res.redirect('/404');
    }

    cube[`difficultyLevel${cube.difficultyLevel}`] = true;

    if (!cube) {
        return res.redirect('/404');
    }

    res.render('cube/edit', { cube });
});

router.post('/:cubeId/edit', async (req, res) => {
    let modifiedCube = await cubeService.edit(req.params.cubeId, req.body);

    res.redirect(`/cube/details/${modifiedCube._id}`);
});

router.get('/:cubeId/delete', async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean()

    // TODO: ADD is owner validation
    res.render('cube/delete', { cube });
});

router.post('/:cubeId/delete', async (req, res) => {
    await cubeService.delete(req.params.cubeId);

    res.redirect('/');
});


module.exports = router;
