const expect = require('chai').expect
const assert = require('chai').assert
const sinon = require('sinon');
const validator = require('../../src/utils/userInfoValidator')

let initialuserDatabase = [{
    _id: 1,
    email: "achintya@notmyactualemailcommitedtogithubinplaintext.com",
    password: "",
    preferred_country: "in",
    preferred_topic: "technology"
}]

let userDatabase = JSON.parse(JSON.stringify(initialuserDatabase));

let userDetails = {
    "email": "testuser@email.com",
    "password": "asdfasdfasdfasdfasdfasdfasdfasdf",
    "preferred_country": "ae",
    "preferred_topic": "business"
}

let userDetailsUpdate = {
    "preferred_country": "in",
    "preferred_topic": "technology"
}


describe('Testing the userValidatorFunction', function() {
    let validateUniqueUserSpy;
    let validateEmailSpy;
    let validatePasswordSpy;
    let validateTopicSpy;
    let validateCountrySpy;

    beforeEach((done) => {
        validateUniqueUserSpy = sinon.spy(validator, "validateUniqueUser");
        validateEmailSpy = sinon.spy(validator, "validateEmail");
        validatePasswordSpy = sinon.spy(validator, "validatePassword");
        validateTopicSpy = sinon.spy(validator, "validateTopic");
        validateCountrySpy = sinon.spy(validator, "validateCountry");
        done();
    });

    afterEach((done) => {
        userDatabase = JSON.parse(JSON.stringify(initialuserDatabase));
        validateUniqueUserSpy.restore();
        validateEmailSpy.restore();
        validatePasswordSpy.restore();
        validateTopicSpy.restore();
        validateCountrySpy.restore();
        done();
    });


    it('1.Validating the happy flow for user registration', function(done) {
        let response = validator.validateNewUserInfo(userDetails, userDatabase);
        expect(response.status).equal(true);
        expect(response.response_message).equal('User registered succesfully');
        expect(validateUniqueUserSpy.calledOnce);
        expect(validateEmailSpy.calledOnce);
        expect(validatePasswordSpy.calledOnce);
        expect(validateTopicSpy.calledOnce);
        expect(validateCountrySpy.calledOnce);
        done();
    })
    it('2. Validating email format check', function(done) {
        let tempUserDetails = JSON.parse(JSON.stringify(userDetails));
        tempUserDetails.email = "invalid email test";
        let response = validator.validateNewUserInfo(tempUserDetails, userDatabase);
        expect(response.status).equal(false);
        expect(response.response_message).equal('Invalid email');
        done();
    })
    it('3. Validating password length check', function(done) {
        let tempUserDetails = JSON.parse(JSON.stringify(userDetails));
        tempUserDetails.password = "1234567";
        let response = validator.validateNewUserInfo(tempUserDetails, userDatabase);
        expect(response.status).equal(false);
        expect(response.response_message).equal('Invalid password');
        done();
    })
    it('4. Validating valid topic check', function(done) {
        let tempUserDetails = JSON.parse(JSON.stringify(userDetails));
        tempUserDetails.preferred_topic = "coding";
        let response = validator.validateNewUserInfo(tempUserDetails, userDatabase);
        expect(response.status).equal(false);
        expect(response.response_message).equal('Invalid topic');
        done();
    })
    it('5. Validating valid country check', function(done) {
        let tempUserDetails = JSON.parse(JSON.stringify(userDetails));
        tempUserDetails.preferred_country = "India";
        let response = validator.validateNewUserInfo(tempUserDetails, userDatabase);
        expect(response.status).equal(false);
        expect(response.response_message).equal('Invalid country');
        done();
    })
    it('6. Validating unique user email', function(done) {
        userDetails.email = "achintya@notmyactualemailcommitedtogithubinplaintext.com"
        let response = validator.validateNewUserInfo(userDetails, userDatabase);
        expect(response.status).equal(false);
        expect(response.response_message).equal('User already exists');
        expect(validateUniqueUserSpy.calledOnce);
        done();
    })
    it('7. Validating preferences update happy flow', function(done) {
        let response = validator.validatePreferencesUpdate(userDetailsUpdate, userDatabase);
        expect(response.status).equal(true);
        expect(response.response_message).equal('Preferences updated succesfully');
        expect(validateTopicSpy.calledOnce);
        expect(validateCountrySpy.calledOnce);
        done();
    })
})