import express from 'express';
import gameController from '../controller/gameController.js';
import authMiddleware from '../services/authService.js';

const gameRouter = express.Router();

gameRouter.post('/',authMiddleware.authenticate.bind(authMiddleware), gameController.createGameData);

gameRouter.get('/:userId', authMiddleware.authenticate.bind(authMiddleware), gameController.getGameData);

gameRouter.patch('/:userId',authMiddleware.authenticate.bind(authMiddleware), gameController.updateGameData);

gameRouter.delete('/:userId',authMiddleware.authenticate.bind(authMiddleware), gameController.deleteGameData);

export default gameRouter;
