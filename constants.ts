
import type { User, Chat, Message, Transaction, Task, Status, FriendRequest, Notification } from './types';
import { MessageType, TransactionType, TaskType, StatusType, NotificationType } from './types';

export const PAYSTACK_PUBLIC_KEY = 'pk_test_50373bbd6c229103062a5570eaa20fa77426f97b';

export const users: { [key: string]: User } = {
  'user-me': { id: 'user-me', name: 'Me', avatarUrl: 'https://i.pravatar.cc/150?u=user-me', bio: 'Digital creator ✨', email: 'chitchat.user@example.com' },
  'user-1': { id: 'user-1', name: 'Danielle', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
  'user-2': { id: 'user-2', name: 'James', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  'user-3': { id: 'user-3', name: 'Sophia', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  'user-4': { id: 'user-4', name: 'John', avatarUrl: 'https://i.pravatar.cc/150?u=user-4' },
};

const messages_user_1: Message[] = [
    { id: 'm1-1', senderId: 'user-1', text: 'Hey, how are you?', timestamp: '10:30 AM', type: MessageType.TEXT },
    { id: 'm1-2', senderId: 'user-me', text: 'I am good, thanks! How about you?', timestamp: '10:31 AM', type: MessageType.TEXT, read: true },
    { id: 'm1-3', senderId: 'user-1', text: 'Doing great! Just working on the new project.', timestamp: '10:32 AM', type: MessageType.TEXT },
    { id: 'm1-4', senderId: 'user-1', type: MessageType.VOICE, voiceDuration: "0:15", timestamp: "10:33 AM" },
    { id: 'm1-5', senderId: 'user-me', type: MessageType.IMAGE, imageUrl: 'https://picsum.photos/seed/chat1/400/300', timestamp: '10:35 AM', read: true },
];

const messages_user_2: Message[] = [
    { id: 'm2-1', senderId: 'user-me', text: 'Can you send me the report?', timestamp: 'Yesterday', type: MessageType.TEXT, read: true },
    { id: 'm2-2', senderId: 'user-2', text: 'Sure, I will send it in a bit.', timestamp: 'Yesterday', type: MessageType.TEXT },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-1',
    user: { ...users['user-1'], isTyping: true },
    messages: messages_user_1,
    lastMessage: messages_user_1[messages_user_1.length-1],
    unreadCount: 2
  },
  {
    id: 'chat-2',
    user: users['user-2'],
    messages: messages_user_2,
    lastMessage: messages_user_2[messages_user_2.length-1]
  },
  {
    id: 'chat-3',
    user: users['user-3'],
    messages: [],
    lastMessage: { id: 'lm3', senderId: 'user-3', text: 'See you tomorrow!', timestamp: 'Wednesday', type: MessageType.TEXT }
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't-1', type: TransactionType.RECEIVED, user: users['user-1'], description: 'From Danielle', date: '2024-07-28', amount: 5000, currency: 'NGN'},
    { id: 't-2', type: TransactionType.SENT, user: users['user-2'], description: 'Sent to James', date: '2024-07-27', amount: 2500, currency: 'NGN'},
    { id: 't-3', type: TransactionType.FUNDED, description: 'Funded from Bank', date: '2024-07-25', amount: 10000, currency: 'NGN'},
];

export const MOCK_TASKS: Task[] = [
    { id: 'task-1', type: TaskType.CHECKLIST, title: 'Grocery Shopping', createdAt: '2024-07-28T10:00:00Z', items: [{ id: 'ci-1', text: 'Milk', completed: true }, { id: 'ci-2', text: 'Bread', completed: false }, { id: 'ci-3', text: 'Eggs', completed: false }] },
    { id: 'task-2', type: TaskType.TEXT, title: 'Project Ideas', content: 'Brainstorm ideas for the Q3 project. Focus on user engagement.', createdAt: '2024-07-27T15:30:00Z', dueDate: '2024-08-05' },
    { id: 'task-3', type: TaskType.VOICE_MEMO, title: 'Meeting Reminder', voiceDuration: '0:25', createdAt: '2024-07-26T09:00:00Z' }
];

export const MOCK_STATUSES: Status[] = [
    { id: 's-1', user: users['user-2'], type: StatusType.IMAGE, imageUrl: 'https://picsum.photos/seed/status1/300/500', timestamp: '2 hours ago', viewed: false, caption: 'Great day out!' },
    { id: 's-2', user: users['user-3'], type: StatusType.TEXT, text: 'Feeling excited for the weekend!', backgroundColor: '#3B82F6', timestamp: '5 hours ago', viewed: false },
    { id: 's-3', user: users['user-4'], type: StatusType.IMAGE, imageUrl: 'https://picsum.photos/seed/status2/300/500', timestamp: 'Yesterday', viewed: true, caption: 'Throwback!' }
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
    { id: 'fr-1', user: users['user-4'] }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n-1', user: users['user-2'], type: NotificationType.STATUS_LIKE, timestamp: '15m ago', isRead: false, statusPreview: { imageUrl: 'https://picsum.photos/seed/status1/100/100' } },
    { id: 'n-2', user: users['user-3'], type: NotificationType.STATUS_COMMENT, commentText: "Can't wait!", timestamp: '1h ago', isRead: false, statusPreview: { text: "Weekend plans!", backgroundColor: '#10B981' } },
    { id: 'n-3', user: users['user-4'], type: NotificationType.FRIEND_REQUEST, timestamp: '3h ago', isRead: true },
    { id: 'n-4', user: users['user-1'], type: NotificationType.WALLET_RECEIVED, amount: '₦5,000', timestamp: 'Yesterday', isRead: true },
];
