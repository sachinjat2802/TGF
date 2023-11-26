/* The AuthMiddlewareService class is responsible for authenticating requests by
verifying JWT tokens and checking if the user exists in the database. */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import pool from '../connectors/mySql.js';
import process from 'process';

class AuthMiddlewareService {
	constructor() {
		this.verifyJwt = promisify(jwt.verify);
	}

	async authenticate(req, res, next) {
		const token = req.header('Authorization');

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Access denied. Token is missing.' });
		}

		try {
			const decoded = await this.verifyJwt(token, process.env.JWT_SECRET);

			const [rows] = await pool
				.getPool()
				.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);

			if (rows.length === 0) {
				return res
					.status(401)
					.json({ message: 'Invalid token. User not found.' });
			}

			req.user = rows[0];
			next();
		} catch (error) {
			console.error(error);
			return res.status(401).json({ message: 'Invalid token.' });
		}
	}
}

export default new AuthMiddlewareService();
