const {body , validationResult}  = require('express-validator');

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

exports.register = async (req, res) => {
    try {
        const err = validationResult(req);

        if(!err.isEmpty()){
            res.status(400).json({ errors: err.array().map(err => err.msg)});
        } else {
            const { username, password } = req.body;

            const userRole = await Role.findOne({ name: "USER" });

            const newUser = new User({ username, password, role: userRole._id });
            newUser.save();

            res.status(201).json({ success: true });
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.toggleAdmin = async (req, res) => {
    const role = await Role.findById(req.user.role);

    if( role.name !== "ADMIN") {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        try {
            const flag = req.params.boolFlag;
            let selectedRole = null;
    
            switch(flag) {
                case "true": {
                    selectedRole = await Role.findOne({ name: "ADMIN" });
                    break;
                }
                case "false": {
                    selectedRole = await Role.findOne({ name: "USER" });
                    break;
                }
            }
    
            if(selectedRole === null){
                res.status(404).json({ success: false, message: "Role not found." });
            }
    
            const user = await User.findByIdAndUpdate(req.params.userId, {role: selectedRole._id}, { new: true })
    
            if(user ===  null) {
                res.status(404).json({ success: false, message: "User not found." });
            } else {
                res.status(200).json({ success: true });
            }
        } catch(err) {
            res.status(400).json({success: false, message: err.message});
        }
    }
}