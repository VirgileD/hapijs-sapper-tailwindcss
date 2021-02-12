'use strict';
var JWT         = require('jsonwebtoken');   // used to sign our content
var JWT_SECRET        = process.env.JWTKEY || 'NeverShareYourSecret';
var aguid       = require('aguid');

module.exports = [{
    method: 'GET',
    path: '/',
    config: { 
        auth: false,
        description: 'non protected hello'
    },
    handler: (request, h) => 'Hello'
},
{
    method: 'GET',
    path: '/prot',
    config: { 
        auth: 'jwt',
        description: 'protected hello'
    },
    handler: function(request, h) {
        return h.response({ message: 'Hello prot '+request.session.test})
            .code(200)
            .type('application/json')
            .state("token", request.auth.token );// to update the ttl of the token cookie
    }
},
{
    method: 'GET',
    path: '/login',
    config: { 
        auth: false,
        description: 'obviously non protected login endpoint - just hit to log in'
    },
    handler: function(request, h) {
        // TODO: here you should use e.g. email and password in the request body to check the user against e.g. a db
        // var { email, password } = req.body;
        // const bcrypt = require("bcryptjs");
        // const salt = await bcrypt.genSalt(10);
        // crypted_password = await bcrypt.hash(password, salt);
        // if(!db.users.find({ email: email, password: crypted_password })) h.response({ message: 'invalid credentials'}).type('application/json').code(401); 
        var session = { id: aguid() };
        // sign the session as a JWT
        var token = JWT.sign(session, JWT_SECRET); // synchronous
        console.log("New token created: "+token);
        request.session = session;
        // you can add other data in session with 
        request.session.test = 'test';
        return h.response({ message: 'logged in'})
            .code(200)
            .type('application/json')
            .state("token", token );
    }
},
{
      method: ['GET'],
      path: "/logout",
      config: { 
        auth: 'jwt',
        description: 'obviously protected logout endpoint - just hit to log out'
      },
      handler: function(request, h) {
        delete request.session;
        return h.response({ message: 'logged out'})
            .code(200)
            .type('application/json')
            .unstate('token');
      }
}]