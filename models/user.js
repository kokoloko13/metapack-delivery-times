const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Role = require('./role');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    }
});

userSchema.pre('save', function encryptPassword(next) {
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if(hashErr) return next(hashErr);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJWT = async function() {
    const today = new Date();
    const expDate = new Date(today);
    expDate.setDate(today.getDate() + 10);

    const role = await Role.findById(this.role); 

    let payload = {
        id: this._id,
        username: this.username,
        role: role.name
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expDate.getTime() / 1000, 10)
    });
};

module.exports = mongoose.model('User', userSchema);