const base = 'PROCESS_ENV__API_URI';

async function send({ method, path, data, token }) {
	const fetch = process.browser ? window.fetch : require('node-fetch').default;

	const opts = { method, headers: {} };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.headers['Accept'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['authorization'] = `${token}`;
	}
	//console.log(`fetching ${base}/${path} whith opts: ${JSON.stringify(opts)}`)
	return await fetch(`${base}/${path}`, opts);
}

export function get(path, token) {
	return send({ method: 'GET', path, token });
}

export function del(path, token) {
	return send({ method: 'DELETE', path, token });
}

export function post(path, data, token) {
	return send({ method: 'POST', path, data, token });
}

export function put(path, data, token) {
	return send({ method: 'PUT', path, data, token });
} 