'use strict';

module.exports = [
{
    method: 'GET',
    path: '/',
    config: { 
        auth: false,
        description: 'non protected hello'
    },
    handler: (request, h) => JSON.stringify({ message: 'Hello' })
},
{
    method: 'GET',
    path: '/prot',
    config: { 
        auth: 'jwt',
        description: 'protected hello'
    },
    handler: function(request, h) {
        return h.response({ message: 'Hello protected'})
            .code(200)
            .type('application/json');
    }
}]