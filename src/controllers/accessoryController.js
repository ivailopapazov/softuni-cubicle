const router = require('express').Router();

const accessoryService = require('../services/accessoryService');

router.get('/create', (req, res) => {
    res.render('accessory/create');
});

router.post('/create', async (req, res) => {
    await accessoryService.create(req.body);
    
    res.redirect('/');
});

module.exports = router;