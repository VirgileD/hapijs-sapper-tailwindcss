'use strict';

const Hapi = require('@hapi/hapi');
const Blipp = require('blipp');
const Path = require('path');
const Wurst = require('wurst');
const Config = require('configue');

// the env var MUST contain JWTKEY
if(process.env.NODE_ENV!=='development' && !process.env.JWTKEY) {
    console.error('You must set JWTKEY env var when in production');
    process.exit(1);
}
// and can define SERVER__HOST (localhost), SERVER__PORT(3001), TOKENTTL(60*60*1000 i.e. 1h), LOGLEVEL (production=>info, dev=>debug)
// which can all be prefixed by "XXX_" where XXX is set by process.env.APP_NAME or by __ if APP_NAME is not set
// these can also pe put in the config.yaml file
const config = new Config({
  disable: {argv: true},
  files: [{file: './config.yaml', format: require('nconf-yaml')}],
  normalize: 'lowerCase',
  separator: '__',
  ignorePrefix: process.env.APP_NAME ? process.env.APP_NAME + '_' : '__',
  // you can use `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"` to generate a good jwtkey
  defaults: { server: { host: 'localhost', port: 3001, routes: { cors: true }}, jwtkey: 'NotAGoodJwtKey' },
  models: {serverOptions: {host: 'server:host', port: 'server:port', routes: { cors:  'server:routes:cors' }}}
});

const validate = async function (decoded, request, h) {
    request.logger.debug('validate '+decoded.id);
    request.logger.debug('validate '+JSON.stringify(request.session));
    if(decoded.id === request.session.id) {
      request.logger.debug('valid');
      return { isValid: true };
    } else {
      request.logger.debug('not valid');
      return { isValid: false };
    }
};


const init = async () => {
    const server = Hapi.server(config._.serverOptions);
    
    await server.register(config.plugin17('conf'));
    
    await server.register({ plugin: Blipp, options: { showAuth: true } });
    
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', { key: config.get('jwtkey'), // Never Share your secret key
        validate,  // validate function defined above
        verifyOptions: {
            algorithms: [ 'HS256' ]    // specify your secure algorithm
        }
    });
    server.auth.default('jwt');
    
    await server.register({ plugin: Wurst,
        options: {
            // ignore: 'foo/**/*.js',
            cwd: Path.join(__dirname, 'routes'),
            routes: '**/*routes.js',
            log: true
        },
    });
    
    await server.register({
        plugin: require('hapi-server-session'),
        options: {
            cookie: {
                isSecure: true, // never set to false in production
            },
        },
    });
    
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: process.env.NODE_ENV !== 'production',
            logPayload: false,
            getChildBindings: (request) => ({ }), // avoid displaying req at each log
            ignorePaths: ["/service-worker.js"], // browser always requests that
            // Redact Authorization headers, see https://getpino.io/#/docs/redaction
            // redact: ['req.headers.authorization'], // to use if there is something to hide in logs
            timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`, // instead of a unreadable timestamp
            level: config.get('loglevel', process.env.NODE_ENV !== 'production' ? 'debug' : 'info')
        }
    });
    
    server.state('token', {
        ttl: config.get('tokenttl',60 * 60 * 1000), // expires an hour from now
        encoding: 'none',    // we already used JWT to encode
        isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: true,    // prevent client alteration
        clearInvalid: true,  // remove invalid cookies
        path: '/',           // so the token cookie set by /auth/login will be sent for any path
        strictHeader: true   // don't allow violations of RFC 6265
    });
    await server.start();
    server.logger.debug('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
