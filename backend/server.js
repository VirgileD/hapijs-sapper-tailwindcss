'use strict';

const Hapi = require('@hapi/hapi');
const Blipp = require('blipp');
const Path = require('path');
const Wurst = require('wurst');
const Config = require('configue');

// the env var MUST contain JWTKEY
const check_env_var = process.env.JWTKEY && process.env.APP_NAME && process.env.APP_FQDN
if(process.env.NODE_ENV!=='development' && !check_env_var) {
    console.error('You must set JWTKEY env var when in production');
    console.error('You must set APP_NAME env var when in production');
    console.error('You must set APP_FQDN env var when in production');
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
  ignorePrefix: process.env.APP_NAME ? process.env.APP_NAME + '_' : 'XXXX_',
  // you can use `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"` to generate a good jwtkey
  defaults: { 
    server: { host: 'localhost', port: 3001, routes: { cors: true }}, 
    jwtkey: 'NotAGoodJwtKey', 
    app_name: process.env.APP_NAME ? process.env.APP_NAME : 'XXXX',
    app_id: process.env.APP_FQDN ? process.env.APP_FQDN : 'localhost',
  },
  models: {serverOptions: {host: 'server:host', port: 'server:port', routes: { cors:  'server:routes:cors' }}}
});

// this is the function used to validate the decoded JWT token
const validate = async function (decoded, request, h) {
    return { isValid: true };
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

    await server.start();
    server.logger.debug('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
