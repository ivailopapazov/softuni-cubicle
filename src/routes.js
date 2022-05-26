const experss = require('express');

const homeController = require('./controllers/homeController');
const cubeController = require('./controllers/cubeController');

const router = experss.Router();

router.get('/', homeController.index);
router.get('/about', homeController.about);

router.use('/cube', cubeController);

module.exports = router;
