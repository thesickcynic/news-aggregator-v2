const preferencesRoute = require('express').Router();
const verifyToken = require('../middleware/authorizeJWT')
const Validator = require('../utils/userInfoValidator');
const bodyParser = require('body-parser');

preferencesRoute.use(bodyParser.urlencoded({ extended: false }));
preferencesRoute.use(bodyParser.json());

preferencesRoute.get('/preferences', verifyToken, (req, res) => {
    if(!req._id && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        })
    } else if (!req._id && req.message) {
        res.status(403).send({
            message: req.message
          });
    } else {
        const preferencesFound = userDatabase[req._id];
        res.status(200).send({
            email: preferencesFound.email,
            preferred_country: preferencesFound.preferred_country,
            preferred_topic: preferencesFound.preferred_topic
        })
    }
});

preferencesRoute.put('/preferences', verifyToken, (req, res) => {
    if(!req._id && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        })
    } else if (!req._id && req.message) {
        res.status(403).send({
            message: req.message
          });
    } else {
        const validatorResponse = Validator.validatePreferencesUpdate(req.body, userDatabase);
        const validatorStatus = validatorResponse.status;
        const validatorMessage = validatorResponse.response_message;

        if (validatorStatus) {
            userDatabase[req._id].preferred_country = req.body.preferred_country;
            userDatabase[req._id].preferred_topic = req.body.preferred_topic;
            res.status(200).send({
                message: validatorMessage
            })
        } else {
            res.status(400).send({
                message: validatorMessage
            })
        }
    
    }
});

module.exports = preferencesRoute;