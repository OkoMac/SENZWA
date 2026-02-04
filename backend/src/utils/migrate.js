#!/usr/bin/env node
/**
 * Database Migration Runner
 * Usage:
 *   node src/utils/migrate.js          # Run all pending migrations
 *   node src/utils/migrate.js rollback  # Rollback last batch
 *   node src/utils/migrate.js status    # Show migration status
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/database');
const logger = require('./logger');

async function run() {
  const command = process.argv[2] || 'latest';

  try {
    switch (command) {
      case 'latest': {
        console.log('Running pending migrations...');
        const [batch, migrations] = await db.migrate.latest();
        if (migrations.length === 0) {
          console.log('Already up to date.');
        } else {
          console.log(`Batch ${batch}: ran ${migrations.length} migration(s)`);
          migrations.forEach((m) => console.log(`  - ${m}`));
        }
        break;
      }
      case 'rollback': {
        console.log('Rolling back last batch...');
        const [batch, migrations] = await db.migrate.rollback();
        if (migrations.length === 0) {
          console.log('Nothing to rollback.');
        } else {
          console.log(`Rolled back batch ${batch}: ${migrations.length} migration(s)`);
          migrations.forEach((m) => console.log(`  - ${m}`));
        }
        break;
      }
      case 'status': {
        const [completed] = await db.migrate.list();
        console.log(`Completed migrations: ${completed.length}`);
        completed.forEach((m) => console.log(`  ✓ ${m.name}`));
        break;
      }
      default:
        console.log('Unknown command. Use: latest, rollback, or status');
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    logger.error('Migration error', { error: err.message, stack: err.stack });
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

run();
