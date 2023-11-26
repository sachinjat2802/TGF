import express from 'express';
import dotenv from 'dotenv';
import process from 'process';
import echoRoute from './routes/echo.js';
import mysqlSetup from './connectors/mySql.js';
import mongodbSetup from './connectors/mongodb.js';
import userRouter from './routes/user.js';
import gameRouter from './routes/game.js';
import RabbitMQConnection from './connectors/rabbitMQ.js';
dotenv.config();


/* The App class sets up and configures various components such as MongoDB, MySQL,
middleware, routes, and RabbitMQ, and starts the server. */
class App {
	/**
	 * The constructor function sets up various components and configurations for a
	 * JavaScript application.
	 */
	constructor() {
		this.app = express();
		this.setupMongodb();
		this.setupMysql();
		this.setupMiddleware();
		this.echo();
		this.setupRoutes();
		this.setupRabbitMQ();
	}

	/**
	 * The function "setupMysql" sets up a connection to a MySQL database using a
	 * connection pool.
	 */
	setupMysql() {
		this.mysqlConnection = mysqlSetup.getPool();
	}

	/**
	 * The function "setupMongodb" connects to a MongoDB database.
	 */
	async setupMongodb() {
		mongodbSetup.connect();
	}

	

	/**
	 * The function sets up middleware for handling JSON requests and error handling
	 * in a JavaScript application.
	 */
	setupMiddleware() {
		this.app.use(express.json());
		// Error handling middleware
		this.app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).send('Something broke!');
			next();
		});
	}

	/**
	 * The above function sets up a route for handling requests to the root URL and
	 * uses the echoRoute middleware.
	 */
	echo() {
		this.app.use('/', echoRoute);
	}

	/**
	 * The function sets up routes for the user and game routers in a JavaScript
	 * application.
	 */
	setupRoutes() {
		this.app.use('/user', userRouter);
		this.app.use('/game', gameRouter);
	}

	/**
	 * The function sets up a connection to RabbitMQ and logs a message when the
	 * connection is successful.
	 */
	setupRabbitMQ() {
		this.rabbitMQConnection = new RabbitMQConnection();
		this.rabbitMQConnection.connect().then(() => {
			console.log('Connected to RabbitMQ');
		});
	}

	/**
	 * The startServer function starts a server and listens on the specified port.
	 */
	startServer() {
		this.app.listen(parseInt(process.env.PORT), () => {
			console.log(`Server is running on port ${process.env.PORT}`);
		});
	}
}

/* `const app = new App();` creates a new instance of the `App` class and assigns
it to the `app` constant. This allows us to access and use the methods and
properties defined in the `App` class. */
const app = new App();
/* `app.startServer();` is calling the `startServer()` method of the `App` class.
This method starts the server and listens on the specified port for incoming
requests. */
app.startServer();