const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Delivery Times API  - POST /authorize', () => {

    /**
     * Test the Authorize route (POST)
    */
        it("It SHOULD get response with code 200 & user token", (done) => {
            const user = {
                username: "test1@test.pl",
                password: "test123"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('token');
                    done();
                });
        });

        it("(NO USERNAME) - It SHOULD get response with code 400 & errors array", (done) => {
            const user = {
                password: "test123"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                });
        });

        it("(NO PASSWORD) - It SHOULD get response with code 400 & errors array", (done) => {
            const user = {
                username: "test1@test.pl"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                });
        });

        it("(NO BODY) - It SHOULD get response with code 400 & errors array", (done) => {
            chai.request(app)
                .post('/authorize')
                .send({})
                .end( (err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                });
        });

        it("(WRONG PASSWORD) - It SHOULD get response with code 401 & error message", (done) => {
            const user = {
                username: "test1@test.pl",
                password: "test1232"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                });
        });

        it("(WRONG USERNAME) - It SHOULD get response with code 404 & error message", (done) => {
            const user = {
                username: "test1123@test.pl",
                password: "test123"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                });
        });

        it("(USERNAME - NO EMAIL) - It SHOULD get response with code 400 & errors array", (done) => {
            const user = {
                username: "test12333",
                password: "test123"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                });
        });

        it("(PASSWORD < 6 CHARS) - It SHOULD get response with code 400 & errors array", (done) => {
            const user = {
                username: "test1@test.pl",
                password: "test1"
            };

            chai.request(app)
                .post('/authorize')
                .send(user)
                .end( (err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                });
        });


    /**
     * Test the create module route (POST)
    */

    /**
     * Test the delete module route (DELETE)
    */

    /**
     * Test the update module route (PUT)
    */

    /**
     * Test the calculate transit times route (GET)
    */

});
