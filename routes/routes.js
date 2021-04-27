const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const Auth = require('../controllers/auth');

const Modules = require('../controllers/modules');

const Services = require('../controllers/services');

const passport = require('passport');
require("../utils/jwt")(passport);

const authenticate = require('../utils/authenticate');

router.use(passport.initialize());

router.get('/', (req, res) => {
    res.send("Welcome to delivery-time API");
});


router.post('/authorize', [

    check('username', "Username is invalid").exists().withMessage('Username (email) is required').normalizeEmail().isEmail().withMessage('Username is invalid'),
    check('password', 'Password must be at least 6 characters').exists().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')

], Auth.authorize);

router.get('/test', authenticate, Auth.test);

router.get('/:moduleCode/transitTimes', authenticate, Modules.calc);

// MODULES CREATE / UPDATE / DELETE

router.post('/modules', authenticate, Modules.create); // ONLY ADMINS

router.put('/modules', authenticate, Modules.update); // ONLY ADMINS

router.delete('/modules/:id', authenticate, Modules.delete); // ONLY ADMINS

// SERVICES CREATE / UPDATE / DELETE

router.post('/services', authenticate, Services.create); // ONLY ADMINS

router.put('/services', authenticate, Services.update); // ONLY ADMINS

router.delete('/services/:id', authenticate, Services.delete); // ONLY ADMINS


module.exports = router;