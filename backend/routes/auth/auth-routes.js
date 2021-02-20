'use strict';
const jwt = require('jsonwebtoken');   // used to sign our content

function create_jwt_token(public_claims, request_conf) {
     const payload = { 
         iss: `${request_conf.get('app_id')}`,
         sub: `${request_conf.get('app_name')}`,
     }
     Object.keys(public_claims).forEach(function(key) {
         payload[key] = public_claims[key];
     });
     return jwt.sign(payload, request_conf.get('jwtkey'));
}

module.exports = [
{
    path: '/login',
    method: 'POST',
    config: { 
        auth: false,
        description: 'obviously non protected login endpoint - just hit to log in'
    },
    handler: function(request, h) {
        var { email, password } = request.payload;
        // TODO: here you should use e.g. email and password in the request body to check the user against e.g. a db
        // a role can also be retrieved
        const role = ['user'];
        // const bcrypt = require("bcryptjs");
        // if(!db.users.find({ email: email })) h.response({ message: 'unknown user'}).type('application/json').code(404);
        // if(!(user = db.users.find({ email: email }))) h.response({ message: 'unknown user'}).type('application/json').code(404);
        // if (! (await bcrypt.compare(password, user.password))) h.response({ message: 'invalid credentials'}).type('application/json').code(401);
        // and for signup: 
        // const salt = await bcrypt.genSalt(10);
        // crypted_password = await bcrypt.hash(password, salt);
        // here we allow anyone who hits /login with password 'hello'
        if(password==='hello') {
            // create the JWT
            var token = create_jwt_token({ email, role }, request.conf);
            request.logger.debug("New token created: "+token);
            return h.response({ message: 'logged in'})
                .code(200)
                .type('application/json')
                .header("Authorization", token);
        } else {
            return h.response({ message: 'invalid credentials'})
                .code(401)
                .type('application/json');
        }
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
          return h.response({ message: 'logged out'})
            .code(200)
            .type('application/json')
            .unstate('token');
      }
}];