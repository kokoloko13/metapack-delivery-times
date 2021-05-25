// IMPORTS

const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const Auth = require('../controllers/auth');
const Modules = require('../controllers/modules');
const Services = require('../controllers/services');

const authenticate = require('../utils/authenticate');

const passport = require('passport');
require("../utils/jwt")(passport);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

router.use(passport.initialize());





// HOME

router.get('/', (req, res) => {
    res.send("Welcome to delivery-time API. Docs: /docs");
});





// DOCS
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));





// ACCOUNT REGISTER, LOGIN, TOGGLE ADMIN

router.post('/register',[

    check('username', "Username is invalid").exists().withMessage('Username (email) is required').normalizeEmail().isEmail().withMessage('Username is invalid'),
    check('password', 'Password must be at least 6 characters').exists().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')

], Auth.register);

router.put('/:userId/admin/:boolFlag', authenticate, Auth.toggleAdmin); // ONLY ADMINS

router.post('/authorize', [

    check('username', "Username is invalid").exists().withMessage('Username (email) is required').normalizeEmail().isEmail().withMessage('Username is invalid'),
    check('password', 'Password must be at least 6 characters').exists().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')

], Auth.authorize);





// PRED. TIME

router.get('/:moduleCode/transitTimes', authenticate, Modules.calc);





// MODULES CREATE / UPDATE / DELETE

router.post('/modules', authenticate, Modules.create); // ONLY ADMINS

router.put('/modules/:id', authenticate, Modules.update); // ONLY ADMINS

router.delete('/modules/:id', authenticate, Modules.delete); // ONLY ADMINS





// SERVICES CREATE / UPDATE / DELETE

router.post('/services', authenticate, Services.create); // ONLY ADMINS

router.put('/services/:id', authenticate, Services.update); // ONLY ADMINS

router.delete('/services/:id', authenticate, Services.delete); // ONLY ADMINS





module.exports = router;