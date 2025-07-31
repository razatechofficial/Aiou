import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {privateMessagesSchema} from './Schemas/PrivateMessagesSchema';
import PrivateMessage from './Models/PrivateMessages';

const adapter = new SQLiteAdapter({
  schema: privateMessagesSchema,
  jsi: true, // For better performance
  // Optional database name
  dbName: 'podium',
  // Optional migrations
  migrations: {
    validated: true,
    minVersion: 1,
    maxVersion: 1,
    sortedMigrations: [],
  },
  // Optional logging
  onSetUpError: error => {
    console.error('Local Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [PrivateMessage],
});
