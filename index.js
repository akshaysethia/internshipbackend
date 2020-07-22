const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const passport = require('passport');
require('./config/passport-setup');

const userRoutes = require('./routes/userRoutes');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('An Error Occured : ', err);
    } else {
        console.log('Connected to Mongo DB !');
    }
});

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')))
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on Port: http://localhost:${process.env.PORT}`);
});