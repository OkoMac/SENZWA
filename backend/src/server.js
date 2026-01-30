require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Senzwa API server running on port ${PORT}`);
  logger.info(`Environment: ${config.env}`);
});
