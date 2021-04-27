const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    transitTimes: [
        {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            dispatch: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            },
            transit: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            },
            delivery: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            }
        }
    ]
});

const createServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    transitTimes: [
        {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            dispatch: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            },
            transit: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            },
            delivery: {
                duration: {
                    type: Number,
                    required: true
                },
                monday: {
                    type: Number,
                    required: true
                },
                tuesday: {
                    type: Number,
                    required: true
                },
                wednesday: {
                    type: Number,
                    required: true
                },
                thursday: {
                    type: Number,
                    required: true
                },
                friday: {
                    type: Number,
                    required: true
                },
                saturday: {
                    type: Number,
                    required: true
                },
                sunday: {
                    type: Number,
                    required: true
                }
            }
        }
    ]
});

module.exports = mongoose.model('Service', serviceSchema);