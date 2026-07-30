import express from 'express';
import { createWeatherController } from '../controllers/weatherController.js';

const router = express.Router();
const weatherController = createWeatherController();

router.get('/', weatherController.getWeatherPage);
router.get('/suggest-locations', weatherController.getLocationSuggestions);

export default router;
