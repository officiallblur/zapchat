
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isTyping?: boolean;
  bio?: string;
  email?: string;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  STATUS_REPLY = 'status_reply',
}

export interface StatusReply {
    imageUrl?: string;
    backgroundColor?: string;
    statusText?: string;
    liked?: boolean;
    replyText?: string;
}

export interface Message {
  id: string;
  senderId: string; // 'user-me' or another user's id
  text?: string;
  timestamp: string;
  read?: boolean;
  type: MessageType;
  imageUrl?: string;
  voiceUrl?: string;
  voiceDuration?: string;
  statusReply?: StatusReply;
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  lastMessage: Message;
  unreadCount?: number;
}

export enum TransactionType {
  SENT = 'sent',
  RECEIVED = 'received',
  FUNDED = 'funded',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  user?: User;
  description: string;
  date: string;
  amount: number;
  currency: 'NGN';
}

export enum TaskType {
  TEXT = 'text',
  VOICE_MEMO = 'voice_memo',
  CHECKLIST = 'checklist',
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id:string;
  type: TaskType;
  title: string;
  createdAt: string;
  dueDate?: string;
  content?: string;
  voiceUrl?: string;
  voiceDuration?: string;
  items?: ChecklistItem[];
}

export enum StatusType {
    IMAGE = 'image',
    VIDEO = 'video',
    TEXT = 'text'
}

export interface Status {
    id: string;
    user: User;
    type: StatusType;
    timestamp: string;
    imageUrl?: string;
    videoUrl?: string;
    text?: string;
    backgroundColor?: string;
    viewed: boolean;
    caption?: string;
    viewedBy?: User[];
}

export interface FriendRequest {
    id: string;
    user: User;
}

export enum NotificationType {
    STATUS_LIKE = 'status_like',
    STATUS_COMMENT = 'status_comment',
    FRIEND_REQUEST = 'friend_request',
    WALLET_RECEIVED = 'wallet_received',
    WALLET_SENT = 'wallet_sent',
    WALLET_FUNDED = 'wallet_funded',
}

export interface StatusPreview {
    imageUrl?: string;
    text?: string;
    backgroundColor?: string;
}

export interface Notification {
    id: string;
    user: User;
    type: NotificationType;
    timestamp: string;
    isRead: boolean;
    commentText?: string;
    amount?: string;
    statusPreview?: StatusPreview;
}