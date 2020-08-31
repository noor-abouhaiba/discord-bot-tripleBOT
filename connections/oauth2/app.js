require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 53134;
const session = require('express-session');
// const dynamoDBStore = require('connect-dynamodb')(session);
const passport = require('passport');
const path = require('path');
const discordStrategy = require('./strategies/discordStrategy');
// const db_config = require("./../../config/dynamo-db-config");
// const AWS = require("aws-sdk");

// AWS.config.update({
//     region  : db_config.region,
//     endpoint: db_config.endpoint
// });


// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

// Initialize the session
app.use(session({
    // Can be anything that the server knows and the client doesnt know
    secret: 'some random secret',
    cookie: {
        // One day max age access to token
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: true,
    // store: dynamoDBStore({
    //     table: 'sessions',
    //     AWSConfigPath: AWS,
    //     client: new AWS.DynamoDB({ endpoint: db_config.endpoint}),
    // }),
    name: 'tripleBOT-discord.oauth2'
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', userIsAuthorized, (req, res) => {
    res.render('home');
});

function userIsAuthorized(req, res, next) {
    if (req.user) {
        console.log('User is logged in');
        res.redirect('/dashboard');
    }
    else {
        console.log('User is not logged in');
        next();
    }
}

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});

