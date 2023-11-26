import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../connectors/mySql.js';
import process from 'process';
import RabbitMQConnection from '../connectors/rabbitMQ.js';
import EventSubscriber from './eventSubscriberService.js';

/* The UserService class provides methods for user registration and login, with
database queries and event handling. */
class UserService {
	rabbitMQConnection = new RabbitMQConnection();
	eventSubscriber = new EventSubscriber();

	async isUsernameTaken(username) {
		const [rows] = await pool
			.getPool()
			.execute('SELECT * FROM users WHERE username = ?', [username]);
		return rows.length > 0;
	}

	async isEmailTaken(email) {
		const [rows] = await pool
			.getPool()
			.execute('SELECT * FROM users WHERE email = ?', [email]);
		return rows.length > 0;
	}

	async registerUser(username, email, hashedPassword) {
		try {
			if (await this.isUsernameTaken(username)) {
				return { success: false, message: 'Username is already taken' };
			}

			// Check if the email is already taken
			if (await this.isEmailTaken(email)) {
				return { success: false, message: 'Email is already taken' };
			}

			await pool
				.getPool()
				.execute(
					'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
					[username, email, hashedPassword]
				);
			const queue = await this.rabbitMQConnection.sendToQueue(
				'user-registered',
				{ username, email }
			);
			console.log(queue);
			if (queue) {
				console.log('Message sent to queue');
			}
			await this.eventSubscriber.subscribe('user-registered');

			return { success: true, message: 'User registered successfully' };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}

	async loginUser(username, password) {
		try {
			const [rows] = await pool
				.getPool()
				.execute('SELECT * FROM users WHERE username = ?', [username]);

			if (rows.length === 0) {
				return { success: false, message: 'Invalid credentials' };
			}
			const user = rows[0];

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return { success: false, message: 'Invalid credentials' };
			}

			// Generate a JWT token
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});

			return { success: true, token };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}
}

export default new UserService();
