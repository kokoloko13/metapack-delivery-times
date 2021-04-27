const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }
    ],
    deliveryWindow: {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    }  
});

module.exports = mongoose.model('Module', moduleSchema);