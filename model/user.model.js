const mongoose = require('mongoose');
const Task = require('./task.model');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    email: {
        type: String,
        default: '',
        unique: true,
        required: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: 'None',
        required: true
    },
    tasks: [Task]
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;