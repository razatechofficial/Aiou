import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const privateMessagesSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'private_messages',
      columns: [
        {name: 'message_uuid', type: 'string', isIndexed: true},
        {name: 'sender_id', type: 'number'},
        {name: 'recipient_id', type: 'number'},
        {name: 'text_message', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
  ],
});
