'use strict';

const Hapi = require('@hapi/hapi');
const Blipp = require('blipp');
const Path = require('path');
const wurst = require('wurst');

const validate = async function (decoded, request, h) {
    console.log('validate '+decoded.id);
    console.log('validate '+JSON.stringify(request.session));
    if(decoded.id === request.session.id) {
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
    plugin: wurst,
    options: {
      // ignore: 'foo/**/*.js',
      cwd: Path.join(__dirname, 'routes'),
      routes: '**/*routes.js',
      log: true
    },
  })
    await server.register({
        plugin: require('hapi-server-session'),
        options: {
            cookie: {
                isSecure: true, // never set to false in production
            },
        },
    });
    server.state('token', {
        ttl: 60 * 60 * 1000, // expires an hour from now
        encoding: 'none',    // we already used JWT to encode
        isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: true,    // prevent client alteration
        clearInvalid: true, // remove invalid cookies
        path: '/',           // so the token cookie set by /auth/login will be sent for any path
        strictHeader: true   // don't allow violations of RFC 6265
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
