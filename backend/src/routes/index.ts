/**
 * KOROX API Routes
 */

import { Router } from 'express';
import { getSupportedChains, solveIntent } from '../controllers/IntentController.js';

const router = Router();

// Intent routes
router.get('/intents/chains', getSupportedChains);
router.post('/intents/solve', solveIntent);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'KOROX API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
