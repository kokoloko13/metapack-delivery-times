const Service = require('./service');
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

moduleSchema.pre('deleteOne', { document: true }, async function (next) {
    this.services.forEach( async service => {
        const delService = await Service.findById(service);
        if(delService !== null) await delService.deleteOne();
    });
    next();
  });

module.exports = mongoose.model('Module', moduleSchema);