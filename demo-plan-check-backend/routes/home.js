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
    handler: (request, h) => 'Hello prot'
},
{
    method: 'GET',
    path: '/login',
    config: { 
        auth: false,
        description: 'obviously non protected login endpoint - just hit to log in'
    },
    handler: function(request, h) {
        var session = {
            valid: true, // this will be set to false when the person logs out
            id: aguid(), // a random session id
            exp: new Date().getTime() + 60 * 60 * 1000 // expires in 60 minutes time
        };
        // sign the session as a JWT
        var token = JWT.sign(session, JWT_SECRET); // synchronous
        console.log("New token created: "+token);
        request.server.app.sessions[session.id] = session;
        console.log("session added with id "+session.id);
        return h.response({ message: 'logged in'})
            .code(200)
            .type('application/json')
            .header("Authorization", token)
            .state("token", token, request.server.app.cookie_options);
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
        var decoded;
        if("Authorization" in request.headers) {
            console.log("found token in headers");
            decoded = JWT.decode(request.headers.authorization, JWT_SECRET);
        } else if("token" in request.state) {
            console.log("found token in cookies");
            decoded = JWT.decode(request.state.token, JWT_SECRET);
        }
        if(decoded && "id" in decoded) {
            delete request.server.app.sessions[decoded.id];
        }
        return h.response({ message: 'logged out'})
            .code(200)
            .type('application/json');
      }
}]