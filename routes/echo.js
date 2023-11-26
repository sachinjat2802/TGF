import express from 'express';
import process from 'process';


const router = express.Router();

router.get('/version', (req, res) => {
	res.status(200).send({ 'API version': process.env.npm_package_version });
});

export default router;