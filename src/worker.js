/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// Importing necessary functions

// export default {
// 	async fetch(request, env, ctx) {
// 		// Get the value for the "to-do:123" key
// 		// NOTE: Relies on the `TODO` KV binding that maps to the "My Tasks" namespace.

// 		console.log(request);
// 		let value = await env.bloglikes.list();
// 		console.log(value);

// 		// Return the value, as is, for the Response
// 		return new Response(value);
// 	},
// };

import { Hono } from 'hono';
import { cors } from 'hono/cors';
const app = new Hono();

app.use(
	'/blog/:title',
	cors({
		origin: ['https://maatwo.com'],
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.use(
	'/blog/:title/:number',
	cors({
		origin: ['https://maatwo.com'],
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.get('/blog/:title', async (c) => {
	const blogValue = await c.env.bloglikes.get(c.req.param('title'));
	if (blogValue === null) {
		await c.env.bloglikes.put(c.req.param('title'), 0);
	}
	return c.json(await c.env.bloglikes.get(c.req.param('title')));
});

app.post('/blog/:title/:number', async (c) => {
	try {
		const blogIncrement = parseInt(c.req.param('number'));

		if (blogIncrement < 30) {
			const oldNumber = parseInt(await c.env.bloglikes.get(c.req.param('title')));
			console.log(`old:${oldNumber}`);
			const finalNumber = blogIncrement + oldNumber;
			console.log(`final:${finalNumber}`);
			await c.env.bloglikes.put(c.req.param('title'), finalNumber);
			return c.json(201, {
				message: 'Resource successfully updated',
				data: { [`${await c.env.bloglikes.get(c.req.param('title'))}`]: await c.env.bloglikes.get(c.req.param('title')) },
			});
		} else {
			return c.body('Too high!', 400, {
				'Content-Type': 'text/plain',
			});
		}
	} catch (err) {
		return c.body('Not a number', 400, {
			'Content-Type': 'text/plain',
		});
	}
});

export default app;
