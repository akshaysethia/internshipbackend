const mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    taskinfo: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: '',
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Created'
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;