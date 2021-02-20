'use strict';

module.exports = [
{
    method: 'GET',
    path: '/',
    config: { 
        auth: 'jwt',
        description: 'Get all upcoming events'
    },
    handler: (_request, _h) => JSON.stringify({ message: 'Hello' })
}]