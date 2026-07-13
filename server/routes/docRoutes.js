import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = express.Router();

// Read Swagger specification JSON
const swaggerFilePath = join(process.cwd(), 'config', 'swagger.json');
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(readFileSync(swaggerFilePath, 'utf8'));
} catch (err) {
  console.error('Could not load swagger.json:', err);
}

// Serve documentation only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swaggerDocument));
} else {
  router.get('/', (req, res) => {
    res.status(403).json({ success: false, message: 'API documentation is disabled in production' });
  });
}

export default router;
