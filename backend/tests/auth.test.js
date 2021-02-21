'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');


describe('can login and logout', () => {
    let server;
    let token;

    before(async () => {
        server = await init();
    });

    after(async () => {
        await server.stop();
    });

    it('responds with 401 when wrong or no password', async () => {
        var res = await server.inject({
            method: 'post',
            url: '/auth/login',
            payload: { email: '', password: 'helo'}
        });
        expect(res.statusCode).to.equal(401);
        expect(res.headers).to.not.contain('authorization');
        res = await server.inject({
            method: 'post',
            url: '/auth/login',
            payload: { email: ''}
        });
        expect(res.statusCode).to.equal(401);
        expect(res.headers).to.not.contain('authorization');
    });

    it('and you cant access to protected endpoints', async () => {
        var res = await server.inject({
            method: 'get',
            url: '/events'
        });
        expect(res.statusCode).to.equal(401);
    });

    it('with correct credentials responds with 200 and give back a token', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/login',
            payload: { email: '', password: 'hello'}
        });
        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('authorization');
        expect(res.headers['authorization']).to.not.be.empty();
        token = res.headers['authorization'];
    });

    it('you can request protected endpoints with the token set', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/events',
            headers: { authorization: token }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.contains('message');
        expect(JSON.parse(res.payload)['message']).to.equal('Hello');
    });

    it('then you can logout', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/auth/logout',
            headers: { authorization: token }
        });
        expect(res.statusCode).to.equal(200);
    });

    it('but as long as you send the token you can access)', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/events',
            headers: { authorization: token }
        });
        expect(res.statusCode).to.equal(200);
        // is logout useless? no, because in the client, the logout will delete the token.
    });

});
