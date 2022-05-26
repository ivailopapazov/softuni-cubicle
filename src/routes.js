const experss = require('experss');

const homeController = require('./controllers/homeController');

const router = experss.Router();

router.get('/', homeController.index);

module.exports = router;
