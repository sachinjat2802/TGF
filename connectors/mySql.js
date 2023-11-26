/* The MySQLSetup class sets up a connection pool to a MySQL database and creates a
users table if it doesn't exist. */
import mysql from 'mysql2/promise';
import process from 'process';
import dotenv from 'dotenv';
dotenv.config();

class MySQLSetup {
	constructor() {
		this.pool = mysql.createPool({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
		});

		this.setupDatabase();
	}

	async setupDatabase() {
		try {
			await this.pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);

			console.log('MySQL database setup complete');
		} catch (error) {
			console.error('MySQL database setup failed:', error.message);
			process.exit(1);
		}
	}

	getPool() {
		return this.pool;
	}
}

export default new MySQLSetup();
