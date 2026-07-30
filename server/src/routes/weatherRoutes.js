import express from 'express';
import { createWeatherController } from '../controllers/weatherController.js';

const router = express.Router();
const weatherController = createWeatherController();

router.get('/', weatherController.getWeatherPage);

export default router;
