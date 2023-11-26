/* The GameService class provides methods for creating, retrieving, updating, and
deleting game data. */
import gameModel from '../models/gameModel.js';
class GameService {
	async createGameData(userId, playerName, playerStatistics, gameResult) {
		try {
			const game = await gameModel.create(
				userId,
				playerName,
				playerStatistics,
				gameResult
			);
			return { success: true, game };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}

	async getGameData(userId) {
		try {
			const game = await gameModel.findByUserId(userId);
			if (!game) {
				return { success: false, message: 'Game data not found' };
			}

			return { success: true, game };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}

	async updateGameData(userId, data) {
		try {	const data = await this.getGameData(userId);
			if (!data) {
				return { success: false, message: 'Game data not found' };
			}
			if (data.isDeleted) {
				return { success: false, message: 'Game data  deleted' };
			}

			const game = await gameModel.updateByUserId(userId, data);
			return { success: true, game };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}

	async deleteGameData(userId) {
		try {
			
			const game = await gameModel.deleteByUserId(userId);
			return { success: true, game };
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Internal Server Error' };
		}
	}
}

export default new GameService();
