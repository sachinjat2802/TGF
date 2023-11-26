/* The MongoDBSetup class is responsible for connecting to a MongoDB database using
the Mongoose library, with retry functionality in case of connection failures. */
import mongoose from 'mongoose';
import process from 'process';

class MongoDBSetup {
	async connect(retries = 5) {
		try {
			await mongoose.connect(process.env.MONGODB_URI);
			console.log('MongoDB connected successfully');
		} catch (error) {
			if (retries === 0) {
				console.log('No more retries. Exiting...');
				process.exit(1);
			}
			console.log(`Database connection failed. Retrying (${retries} attempts left)...`);
			// Wait for 5 seconds before retrying
			await new Promise((res) => setTimeout(res, 5000));
			return this.connect(retries - 1);
		}
	}
}

export default new MongoDBSetup();
