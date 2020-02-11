const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const lexicalDensityRouter = require('./routes/lexicalDensity.routes');

const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');
const nlwSeeder = require('./seeds/nonLexicalWords.seed');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define application routes
app.use('/', lexicalDensityRouter);

// Establish an initial MongoDB connection
mongoose.connect(dbConfig[process.env.NODE_ENV].url, { useNewUrlParser: true }, async function (err) {
    const shouldLog = process.env.NODE_ENV === 'development';
    if (err) {
        if (shouldLog) console.log(`Unable to connect to MongoDB: ${err}`);
        process.exit(1);
    } else {
        // Attempt seeding of the database if it is currently empty
        await nlwSeeder.seedNonLexicalWords();
        if (shouldLog) console.log('MongoDB successfully initialized, connected and populated.');
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
