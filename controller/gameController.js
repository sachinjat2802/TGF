/* The GameController class handles requests related to game data, including
creating, retrieving, updating, and deleting game data. */
import gameService from '../services/gameService.js';

class GameController {
	async createGameData(req, res) {
		const { playerName, playerStatistics, gameResult } = req.body;
		const userId = req.user.id;

		try {
			const result = await gameService.createGameData(
				userId,
				playerName,
				playerStatistics,
				gameResult
			);
			res.status(result.success ? 201 : 500).json(result);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ success: false, message: 'Internal Server Error' });
		}
	}

	async getGameData(req, res) {
		const { userId } = req.params;

		try {
			const result = await gameService.getGameData(userId);
			res.status(result.success ? 200 : 500).json(result);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ success: false, message: 'Internal Server Error' });
		}
	}

	async updateGameData(req, res) {
		const { userId } = req.params;
		const  data  = req.body;
		try {
			
			const result = await gameService.updateGameData(userId, data);
			res.status(result.success ? 200 : 500).json(result);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ success: false, message: 'Internal Server Error' });
		}
	}

	async deleteGameData(req, res) {
		const { userId } = req.params;
		try {
			const result = await gameService.deleteGameData(userId);
			if (result.game.isDeleted === true) {
				return res
					.status(500)
					.json({ success: false, message: 'game data already deleted' });
			}
			res.status(result.success ? 200 : 500).json(result);
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: 'Internal Server Error' });
		}
	}
}

export default new GameController();
