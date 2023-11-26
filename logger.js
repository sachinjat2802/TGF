import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const logsDir = 'logs';

// Get the directory path of the current module
const currentDir = dirname(fileURLToPath(import.meta.url));

// Ensure the logs directory exists
const ensureLogsDirectory = async () => {
	try {
		await fs.mkdir(join(currentDir, logsDir), { recursive: true });
	} catch (error) {
		if (error.code !== 'EEXIST') {
			console.error('Error creating logs directory:', error);
		}
	}
};

// Create a Winston logger
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({ filename: join(currentDir, logsDir, 'app.log') }),
	],
});

// Ensure the logs directory exists before logging
ensureLogsDirectory();

export default logger;
