/* The UserController class handles user registration and login functionality,
including input validation and password hashing. */
import bcrypt from 'bcrypt';
import Joi from 'joi';
import userService from '../services/userService.js';

class UserController {
	async registerUser(req, res) {
		const { username, email, password } = req.body;

		// Validate input using Joi
		const schema = Joi.object({
			username: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		const validation = schema.validate({ username, email, password });

		if (validation.error) {
			return res
				.status(400)
				.json({ message: validation.error.details[0].message });
		}

		// Hash the password before saving it to the database
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await userService.registerUser(
			username,
			email,
			hashedPassword
		);

		if (result.success) {
			res.status(201).json(result);
		} else {
			res.status(500).json({ message: result.message });
		}
	}

	async loginUser(req, res) {
		const { username, password } = req.body;

		// Validate input using Joi
		const schema = Joi.object({
			username: Joi.string().required(),
			password: Joi.string().min(6).required(),
		});

		const validation = schema.validate({ username, password });

		if (validation.error) {
			return res
				.status(400)
				.json({ message: validation.error.details[0].message });
		}

		const result = await userService.loginUser(username, password);

		if (result.success) {
			res.json(result);
		} else {
			res.status(401).json({ message: result.message });
		}
	}
}

export default new UserController();
