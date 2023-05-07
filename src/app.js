const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const routes = require('express').Router();
const bcrypt = require('bcrypt');
const {register, login} = require('../src/routes/authRoute');
const preferencesRoute = require('../src/routes/preferencesRoute');
const news = require('../src/routes/newsRoute');
const cacheInstance = require('../src/utils/cacheProvider')

console.log("Imports working correctly.")
require("dotenv").config();

const app = express()
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

cacheInstance.start((err) => {
    if (err) {
        console.log("Cache failed to start");
    }
})

routes.post('/register', register);
routes.post('/login', login);
routes.get('/preferences', preferencesRoute);
routes.put('/preferences', preferencesRoute);
routes.get('/news', news);

app.listen(process.env.PORT, (err) => {
    if(err) {
        console.log("Server failed to start.")
    } else {
        console.log("Started.")
    }
})

module.exports = app