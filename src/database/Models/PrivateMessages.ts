import {Model, Q} from '@nozbe/watermelondb';
import {date, field, readonly, text} from '@nozbe/watermelondb/decorators';
import {database} from '..';

export default class PrivateMessage extends Model {
  static table = 'private_messages';

  @field('message_uuid') messageUUID!: string;
  @field('sender_id') senderId!: number;
  @field('recipient_id') recipientId!: number;
  @text('text_message') text_message!: string;
  @field('status') status!: string;
  @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // ✅ CREATE: Message Insertion
  static async createMessage(
    messageUUID: string,
    senderId: number,
    recipientId: number,
    text_message: string,
  ) {
    return await database.write(async () => {
      return await database
        .get<PrivateMessage>('private_messages')
        .create(message => {
          message.messageUUID = messageUUID; // Client-generated UUID
          message.senderId = senderId;
          message.recipientId = recipientId;
          message.text_message = text_message;
          message.status = 'pending'; // Default status
          message.createdAt = new Date();
        });
    });
  }

  // ✅ READ: Messages retrieve
  static async getMessages() {
    return await database
      .get<PrivateMessage>('private_messages')
      .query()
      .fetch();
  }

  // ✅ UPDATE: Message
  static async updateMessageStatus(messageUUID: string, newStatus: string) {
    await database.write(async () => {
      const messages = await database
        .get<PrivateMessage>('private_messages')
        .query(Q.where('message_uuid', messageUUID))
        .fetch();
      if (messages.length > 0) {
        await messages[0].update(msg => {
          msg.status = newStatus;
        });
      }
    });
  }

  // ✅ DELETE: Message
  static async deleteMessage(messageUUID: string) {
    await database.write(async () => {
      const messages = await database
        .get<PrivateMessage>('private_messages')
        .query(Q.where('message_uuid', messageUUID))
        .fetch();
      if (messages.length > 0) {
        await messages[0].markAsDeleted();
      }
    });
  }

  // ✅ READ: Get messages between specific sender & recipient
  static async getMessagesBetweenUsers(senderId: number, recipientId: number) {
    return await database
      .get<PrivateMessage>('private_messages')
      .query(
        Q.or(
          Q.and(
            Q.where('sender_id', senderId),
            Q.where('recipient_id', recipientId),
          ),
          Q.and(
            Q.where('sender_id', recipientId),
            Q.where('recipient_id', senderId),
          ),
        ),
      )
      .fetch();
  }
}
