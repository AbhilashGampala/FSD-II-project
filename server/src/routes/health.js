import { Router } from 'express';
import { getDbStatus } from '../config/db.js';
import { DEMO_MODE, NODE_ENV } from '../config/environment.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'VIT Campus Placement Tracker API',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    demoMode: DEMO_MODE,
    environment: NODE_ENV
  });
});

export default router;
