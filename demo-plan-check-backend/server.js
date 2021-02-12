'use strict';

const Hapi = require('@hapi/hapi');
const Blipp = require('blipp');
const Path = require('path');

const cookie_options = {
  ttl: 60 * 60 * 1000, // expires an hour from today
  encoding: 'none',    // we already used JWT to encode
  isSecure: true,      // warm & fuzzy feelings
  isHttpOnly: true,    // prevent client alteration
  clearInvalid: false, // remove invalid cookies
  strictHeader: true   // don't allow violations of RFC 6265
};

const validate = async function (decoded, request, h) {
    console.log('validating decoded'+JSON.stringify(decoded));
    console.log('look for session in '+JSON.stringify(request.server.app.sessions));
    
    if(decoded.id in request.server.app.sessions &&
        request.server.app.sessions[decoded.id].exp > new Date().getTime()) {
      console.log('valid');
      return { isValid: true };
    } else {
      console.log('not valid');
      return { isValid: false };
    }
};


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    await server.register({ plugin: Blipp, options: { showAuth: true } });
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', { key: 'NeverShareYourSecret', // Never Share your secret key
        validate,  // validate function defined above
        verifyOptions: {
            algorithms: [ 'HS256' ]    // specify your secure algorithm
        }
    });
    server.auth.default('jwt');
    await server.register({
      plugin: require('hapi-auto-route'),
      options: {
        routes_dir: Path.join(__dirname, 'routes')
      }
    });
    server.app.sessions = {};
    server.app.cookie_options = cookie_options;
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
