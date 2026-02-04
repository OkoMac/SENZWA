require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { db } = require('./config/database');

const PORT = config.port;

async function start() {
  // Run pending migrations on startup
  try {
    const [batch, migrations] = await db.migrate.latest();
    if (migrations.length > 0) {
      logger.info(`Database migrated (batch ${batch}): ${migrations.length} migration(s)`);
    } else {
      logger.info('Database schema up to date');
    }
  } catch (err) {
    logger.error('Migration failed - starting anyway', { error: err.message });
  }

  app.listen(PORT, () => {
    logger.info(`Senzwa API server running on port ${PORT}`);
    logger.info(`Environment: ${config.env}`);
  });
}

start();
