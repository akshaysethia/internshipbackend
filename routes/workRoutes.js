const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const User = require('../model/user.model');
const Task = require('../model/task.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/task');
    },
    filename: (req, file, cb) => {
        cb(null, `Task_${file.originalname}`);
    }
});
var upload = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        var ext = path.extname(file.originalname);
        if (ext != '.png' && ext != '.jpg' && ext != '.gif' && ext != '.jpeg') {t
            return cb(new Error('Only Images Allowed !'));
        }
        cb(null, true);
    }, limits: { files: 1, fileSize: 1024 * 1024 }
});

// Add the task to the Task Model
router.post('/addTask', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
    if (req.user.admin) {
        var task = new Task({
            name: req.body.name,
            taskinfo: req.body.taskinfo,
            image: req.file,
            done: false
        });
        Task.create(task)
            .then((taskCreated) => {
                if (!taskCreated) {
                    res.json({ success: false, message: 'Task could not be added !' });
                } else {
                    res.json({ success: true, message: 'Task Added !' });
                }
            })
            .catch((err) => console.log('An Error Occured: ', err));
    } else {
        res.json({ success: false, message: 'You are not an Admin !' });
    }
});

// Assign task to student - get method
router.get('/asignTask/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.admin) {
        Task.findOne({ _id: req.params.taskId })
            .then((task) => {
                if (task) {
                    User.find({ admin: false, category: req.user.category })
                        .then((students) => {
                            if (!students) {
                                res.json({ success: false, message: 'Students could not be found !', students: null, task: task });
                            } else {
                                students = students.filter(student => student.tasks.indexOf(req.params.taskId) === -1);
                                res.json({ success: true, message: 'Students Found !', students: students, task: task });
                            }
                        })
                        .catch((err) => console.log('An Error Occured: ', err));
                } else {
                    res.json({ success: false, message: 'Task Could not be found !', students: null, task: null });
                }
            })
            .catch();
    } else {
        res.json({ success: false, message: 'You are not an Admin !' });
    }
});

// Assign task to student - post method
router.post('/assignTask/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.admin) {
        req.body.id.forEach(id => {
            User.findOne({ _id: id })
                .then((student) => {
                    student.tasks.push(req.params.taskId);
                    student.save()
                        .then((savStu) => {
                            console.log('Task Added to the Student !', savStu);
                        })
                        .catch((err) => console.log('An Error Occured: ', err));
                })
                .catch((err) => console.log('An Error Occured: ', err));
        });
        res.json({ success: true, message: 'Task Added to all Students !' });
    } else {
        res.json({ success: false, message: 'You are not an Admin !' });
    }
});

// get all tasks from a given user
router.get('/allTasks', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({ _id: req.user._id })
        .then((user) => {
            if (user) {
                res.json({ success: true, message: 'Found User !', tasks: user.tasks });
            } else {
                res.json({ success: false, message: 'User not found !', tasks: null });
            }
        })
        .catch((err) => console.log('An Error Occured: ', err));
});

// submit the task to approval
router.post('/submitTask/:taskId', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
    User.findOne({ _id: req.user._id })
        .then((student) => {
            student.tasks = student.tasks.filter(task => task._id !== req.params.taskId);
            var task = new Task({
                name: req.body.name,
                taskinfo: req.body.taskinfo,
                image: req.file,
                done: false,
                status: 'Submitted'
            });
            student.tasks.push(task);
            student.save()
                .then((upStu) => {
                    if (upStu) {
                        res.json({ success: true, message: 'Task Submitted Successfully for Evaluation !' });
                    } else {
                        res.json({ success: false, message: 'Task could not be submitted for evaluation !' });
                    }
                })
                .catch((err) => console.log('An Error Occured: ', err));
        })
        .catch((err) => console.log('An Error Occured: ', err));
});

// get all the users for admin to evaluate
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.admin) {
        User.find({ admin: false, category: req.user.category })
            .then((students) => {
                if (students) {
                    res.json({ success: true, message: 'Got all Students available !', students: students });
                } else {
                    res.json({ success: false, message: 'Oops !', students: null });
                }
            })
    } else {
        res.json({ success: false, message: 'You are not an Admin !' });
    }
});

// submit grade for each user
router.post('/review/:studentId/task/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.admin) {
        User.findOne({ _id: req.params.studentId })
            .then((student) => {
                if (student) {
                    var stask = student.tasks.filter(task => task._id === req.params.taskId)[0];
                    var alltasks = student.tasks.filter(task => task._id !== req.params.taskId);
                    stask.status = 'Reviewed';
                    stask.rating = req.body.rating;
                    stask.done = true;
                    student.tasks = alltasks;
                    student.tasks.push(stask);
                    student.save()
                        .then((savStu) => {
                            if (savStu) {
                                res.json({ success: true, message: 'Score updated !' });
                            } else {
                                res.json({ success: false, message: 'Score could not be updated !' });
                            }
                        })
                        .catch((err) => console.log('An Error Occured: ', err));
                }
            })
            .catch((err) => console.log('An Error Occured: ', err));
    } else {
        res.json({ success: false, message: 'You are not an Admin !' });
    }
});