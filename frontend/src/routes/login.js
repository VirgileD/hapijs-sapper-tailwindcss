// in src/routes/login.js
import { post as api_post } from "./_api.js";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function post(req, res) {
    if(req.body && 'email' in req.body && 'password' in req.body) { 
        const { email, password } = req.body;
        api_post('auth/login', { email, password })
        .then((response_from_api) => {
            if(response_from_api.status===200) {
                req.session.token = response_from_api.headers.get('Authorization');
                res.statusCode = 200;
                res.setHeader('Authorization', req.session.token);
                return res.end();
            } else {
                res.statusCode = response_from_api.status;
                return res.end();
            }
        });
    } else {
        res.statusCode = 400;
        res.statusMessage = 'Was expecting credentials';
        return res.end();
    }
}

