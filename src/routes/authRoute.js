var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const Validator = require('../utils/userInfoValidator');
require("dotenv").config();

let autoID = 2;

global.userDatabase = [{
    _id: 1,
    email: "achintya@notmyactualemailcommitedtogithubinplaintext.com",
    password: "",
    preferred_country: "in",
    preferred_topic: "technology"
}]



var register = (req, res) => {
    const userInfo = req.body;
    const validatorResponse = Validator.validateNewUserInfo(userInfo, userDatabase);
    const validatorStatus = validatorResponse.status;
    const validatorMessage = validatorResponse.response_message;
    
    if(validatorStatus) {
        const user = {
            _id: autoID,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            preferred_country: req.body.preferred_country,
            preferred_topic: req.body.preferred_topic
        }
        userDatabase.push(user);
        autoID++;
        res.status(200).send({message: validatorMessage});
    } else{
        res.status(400).send({message: validatorMessage});
    }
}

var login = (req, res) => {
    const userInfo = req.body;
    const userEmail = userInfo.email;
     const userPassword = userInfo.password;
     const userIndex = userDatabase.findIndex(user => user.email === userEmail);
     if(userIndex != -1) {
        const passwordIsValid = bcrypt.compareSync(userPassword, userDatabase[userIndex].password);
        if(!passwordIsValid) {
            res.status(401).send(
                {
                    accessToken: null,
                    message: "Invalid Password!"
                }
            )
        }
        else {
            var token = jwt.sign({
                _id: userDatabase[userIndex]._id
            }, process.env.SERVER_SECRET, {
                expiresIn: 86400
            });

            res.status(200).send({
                user: {
                    id: userDatabase[userIndex]._id,
                    email:userDatabase[userIndex].email,
                },
                accessToken: token,
                message: "Logged in successfully"
            })
        }
     } else{
        res.status(401).send(res.status(401).send(
            {
                accessToken: null,
                message: "User doesn't exist!"
            }
        ))
     }
}

module.exports = {register, login};

