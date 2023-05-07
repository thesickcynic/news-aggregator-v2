let chai = require("chai");
let chaiHttp = require("chai-http");
const server = require('../../src/app')
const expect = require('chai').expect;
chai.use(chaiHttp);

describe('Verifies the signup flow', () => {
    it("1.Validate succesful signup", (done) => {
        let registerBody = {
            "email": "testuser@email.com",
            "password": "asdfasdfasdfasdfasdfasdfasdfasdf",
            "preferred_country": "ae",
            "preferred_topic": "business"
        }
        chai.request(server).post('/register').send(registerBody).end((err, res) => {
            expect(res.status).equal(200);
            expect(res.body.message).equal("User registered succesfully")
        })
        done();
    })
    it("1.Validate signup with incorrect response", (done) => {
        let registerBody = {
            "email": "testuser@email.com",
            "password": "asdfasdfasdfasdfasdfasdfasdfasdf",
            "preferred_country": "India",
            "preferred_topic": "business"
        }
        chai.request(server).post('/register').send(registerBody).end((err, res) => {
            expect(res.status).equal(400);
            expect(res.body.message).equal("Invalid country")
        })
        done();
    })
} )

describe('Testing new user creation, log in, getting preferences', () => {
    it("Testing end to end flow", (done) => {
        let registerBody = {
            "email": "testuser5@email.com",
            "password": "asdfasdfasdfasdfasdfasdfasdfasdf",
            "preferred_country": "ae",
            "preferred_topic": "business"
        }
        chai.request(server).post('/register').send(registerBody).end((err, res) => {
            expect(res.status).equal(200);
            chai.request(server)
                .post('/login')
                .send(
                    {
                        "email": "testuser5@email.com",
                        "password": "asdfasdfasdfasdfasdfasdfasdfasdf"
                    }
                ).end((err, res) => {
                    expect(res.status).equal(200);
                    expect(res.body).to.have.property('accessToken');
                    let token = res.body.accessToken;

                    chai.request(server)
                        .get('/preferences')
                        .set('Authorization', 'JWT ' + token)
                        .end((err, res) => {
                            expect(res.status).equal(200);
                            expect(res.body.preferred_country).equal("ae");
                            expect(res.body.preferred_topic).equal("business");
                            done();
                        })
                })
        })
        
    })
})

describe('Testing new user creation, log in, updating preferences, getting updated preferences', () => {
    it("Testing end to end flow", (done) => {
        let registerBody = {
            "email": "testuser6@email.com",
            "password": "asdfasdfasdfasdfasdfasdfasdfasdf",
            "preferred_country": "ae",
            "preferred_topic": "business"
        }
        chai.request(server).post('/register').send(registerBody).end((err, res) => {
            expect(res.status).equal(200);
            chai.request(server)
                .post('/login')
                .send(
                    {
                        "email": "testuser6@email.com",
                        "password": "asdfasdfasdfasdfasdfasdfasdfasdf"
                    }
                ).end((err, res) => {
                    expect(res.status).equal(200);
                    expect(res.body).to.have.property('accessToken');
                    let token = res.body.accessToken;

                    chai.request(server).
                        put('/preferences')
                        .set('Authorization', 'JWT ' + token)
                        .send({
                            "preferred_country": "in",
                            "preferred_topic": "technology"
                        })
                        .end((err, res) => {
                            expect(res.status).equal(200);
                            expect(res.body.message).equal("Preferences updated succesfully")
                            chai.request(server)
                            .get('/preferences')
                            .set('Authorization', 'JWT ' + token)
                            .end((err, res) => {
                                expect(res.status).equal(200);
                                expect(res.body.preferred_country).equal("in");
                                expect(res.body.preferred_topic).equal("technology");
                                done();
                        })
                        })
                    
                    
                })
        })
        
    })
})