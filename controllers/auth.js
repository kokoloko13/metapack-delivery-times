const {body , validationResult}  = require('express-validator');

const jwt = require('../utils/jwt');

const User = require('../models/user');
const Role = require('../models/role');


exports.authorize = async (req, res) => {
    try {
            const err = validationResult(req);

            if(!err.isEmpty()){
                res.status(400).json({ errors: err.array().map(err => err.msg)});
            } else {
                const { username, password } = req.body;
                const user = await User.findOne({ username });

                if(!user) return res.status(404).json({message: "Account does not exist"});

                if(!user.comparePassword(password)) return res.status(401).json({message: "Invalid username or password"});

                res.status(200).json({ token: await user.generateJWT() });
            }

    } catch (error) {
        
        res.status(500).json({message: error.message});

    }
}

exports.test = async (req, res) => {
    try {
        const userRole = await Role.findById(req.user.role);
        res.status(200).json( { user: req.user, role: userRole });
    } catch (err) {
        res.status(500).json(err.message);
    }
}