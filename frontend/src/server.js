import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

import { json } from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = new sessionFileStore(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
if(!dev && (!process.env.SESSIONS_SECRET || !process.env.SESSIONS_PATH)) {
    console.error("Please set the SESSIONS_SECRET env var");
    console.error("Please set the SESSIONS_PATH env var");
    process.exit(1);
} else {
    polka() // You can also use Express
        .use(
            json(),
            session({
                //node -e "console.log(require('crypto').randomBytes(256).toString('base64'));
                secret: process.env.SESSIONS_SECRET || 'NotAGoodSessionsSecret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    maxAge: process.env.COOKIES_TTL!==undefined ? Number(process.env.COOKIES_TTL) : (60 * 60 * 1000), // default is one hour
                    sameSite: "Lax",
                },
                store: new FileStore({
                    path: process.env.SESSIONS_PATH || `.sessions`,
                })
            }),
            compression({ threshold: 0 }),
            sirv('static', { dev }),
            sapper.middleware({
                session: (req, res) => {
                    return ({ token: req.session.token });
                }
            })
        )
        .listen(PORT, err => {
            if (err) console.log('error', err);
        });
}