const mongoose = require('mongoose');
require("./movies-model");

console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to', process.env.DB_URL);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error ' + err);
});
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});
process.on('SIGUSR2', () => {
    mongoose.connection.close(() => {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});

