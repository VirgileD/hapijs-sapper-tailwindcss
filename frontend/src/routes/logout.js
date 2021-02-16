// in src/routes/login.js
import { get as api_get } from "./_api.js";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function get(req, res) {
    await api_get('auth/logout');
    delete req.session.token
    res.statusCode = 200;
    return res.end();
}

