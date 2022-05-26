const experss = require('express');

const homeController = require('./controllers/homeController');
const cubeController = require('./controllers/cubeController');

const router = experss.Router();

router.use('/', homeController);
router.use('/cube', cubeController);

module.exports = router;
