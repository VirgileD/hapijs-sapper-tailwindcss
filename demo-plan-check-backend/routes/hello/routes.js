'use strict';

module.exports = [
{
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
}]