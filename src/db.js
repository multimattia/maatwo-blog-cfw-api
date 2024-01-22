import postgres from 'postgres';

const sql = (c) =>
	postgres({
		user: c.env.DB_USERNAME,
		password: c.env.DB_PASSWORD,
		host: c.env.DB_HOST,
		port: c.env.DB_PORT,
		database: c.env.DB_NAME,
	});

export default sql;
