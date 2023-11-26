/* The above class defines a Game model in JavaScript using Mongoose for MongoDB,
with methods for creating, finding, updating, and deleting game records. */
import mongoose from 'mongoose';

class Game {
	constructor(userId, playerName, playerStatistics, gameResult,gameId) {
		this.userId = userId;
		this.playerName = playerName;
		this.playerStatistics = playerStatistics;
		this.gameResult = gameResult;
		this.gameId = gameId;
	}

	static async create(userId, playerName, playerStatistics, gameResult) {
		const game = new GameModel({ userId, playerName, playerStatistics, gameResult });
		await game.save();
		return game;
	}

	static async findByUserId(userId) {
		return GameModel.findOne({ userId , isDeleted: false });
	}

 

	static async updateByUserId(userId, data) { 
		const oldData = this.findByUserId(userId);
		const dataToUpdate = { ...oldData, ...data };
		console.log(dataToUpdate);

		return GameModel.findOneAndUpdate({ userId }, dataToUpdate, { new: true });
	}

	static async deleteByUserId(userId) {
		
		return GameModel.findOneAndUpdate({ userId }, { isDeleted: true }, { new: true });
	}
}

const gameSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	playerName: { type: String, required: true },
	playerStatistics: {
		totalKills: { type: Number, default: 0 },
		areaCovered: { type: Number, default: 0 },
		kd: { type: Number, default: 0 },
		economy: { type: Number, default: 0 },
	},
	gameResult: { type: String, enum: ['win', 'lose', 'draw'] }, 
	isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

gameSchema.loadClass(Game);

const GameModel = mongoose.model('Game', gameSchema);

export default GameModel;
