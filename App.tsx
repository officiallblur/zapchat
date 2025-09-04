import React, { useState } from 'react';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import WalletScreen from './screens/WalletScreen';
import TaskScreen from './screens/TaskScreen';
import StatusScreen from './screens/StatusScreen';
import FriendRequestScreen from './screens/FriendRequestScreen';
import CreateStatusScreen from './screens/CreateStatusScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';
import type { Chat, Status, Message, StatusReply, User, Transaction } from './types';
import { MessageType, StatusType, TransactionType } from './types';
import { MOCK_CHATS, users, MOCK_TRANSACTIONS } from './constants';
import { useTheme } from './hooks/useTheme';

type Screen = 'Chat' | 'Cash' | 'Task' | 'Settings';
type SubScreen = 'ChatDetails' | 'Status' | 'FriendRequests' | 'CreateStatus';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Chat');
  const [activeSubScreen, setActiveSubScreen] = useState<SubScreen | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [myStatus, setMyStatus] = useState<Status | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(users['user-me']);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const { theme } = useTheme();


  const handleNavigate = (screen: Screen) => {
    setActiveScreen(screen);
    setActiveSubScreen(null);
    setSelectedChat(null);
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveSubScreen('ChatDetails');
  };

  const handleBack = () => {
    setSelectedChat(null);
    setActiveSubScreen(null);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      // In a real app, you'd also update this in your global state/backend
      users['user-me'] = updatedUser;
  }

  const handleNavigateToSubScreen = (screen: 'FriendRequests' | 'Status' | 'CreateStatus') => {
      setActiveSubScreen(screen);
  }

  const handleCreateStatus = (status: Status) => {
    // Add mock viewers for demonstration purposes
    const statusWithViewers: Status = {
        ...status,
        viewedBy: [users['user-1'], users['user-2'], users['user-4']],
    };
    setMyStatus(statusWithViewers);
    setActiveSubScreen('Status');
  };

  const handleStatusReply = (status: Status, reply: { type: 'like' | 'comment', text?: string }) => {
    const fromUser = users['user-me'];
    const toUser = status.user;
    
    const targetChat = chats.find(c => c.user.id === toUser.id);
    if (!targetChat) {
      console.error("Cannot reply to status: Chat with user not found.");
      return;
    }

    const statusReply: StatusReply = {
      liked: reply.type === 'like',
      replyText: reply.text,
    };

    if (status.type === StatusType.IMAGE || status.type === StatusType.VIDEO) {
      statusReply.imageUrl = status.imageUrl || status.videoUrl; // Use videoUrl as fallback if imageUrl is not there
    } else if (status.type === StatusType.TEXT) {
      statusReply.statusText = status.text;
      statusReply.backgroundColor = status.backgroundColor;
    }

    const statusReplyMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: fromUser.id,
        type: MessageType.STATUS_REPLY,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        statusReply,
        read: true, // A message sent by the user should be marked as read.
    };
    
    const updatedChats = chats.map(c => 
        c.id === targetChat.id 
        ? { ...c, messages: [...c.messages, statusReplyMessage], lastMessage: statusReplyMessage }
        : c
    );
    setChats(updatedChats);

    // Navigate to chat after reply
    handleChatSelect(targetChat);
  };

  const handleFundWallet = (amount: number, reference: string) => {
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      type: TransactionType.FUNDED,
      description: `Funded via Paystack - ${reference}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      currency: 'NGN'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Successfully funded ₦${amount}!`);
  };

  const handleSendMoney = (recipient: User, amount: number) => {
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      type: TransactionType.SENT,
      user: recipient,
      description: `Sent to ${recipient.name}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      currency: 'NGN'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Successfully sent ₦${amount} to ${recipient.name}!`);
  };

  const handleRequestMoney = (fromUser: User, amount: number) => {
    // In a real app, this would send a notification to the other user.
    // For now, we'll just show an alert to the current user.
    alert(`Request for ₦${amount} sent to ${fromUser.name}.`);
  };


  const renderContent = () => {
    if (activeSubScreen === 'ChatDetails' && selectedChat) {
      return <ChatScreen chat={selectedChat} onBack={handleBack} />;
    }
    if (activeSubScreen === 'Status') {
        return <StatusScreen myStatus={myStatus} onBack={handleBack} onStatusReply={handleStatusReply} onNavigateToSubScreen={handleNavigateToSubScreen} />;
    }
    if (activeSubScreen === 'FriendRequests') {
        return <FriendRequestScreen onBack={handleBack} />;
    }
    if (activeSubScreen === 'CreateStatus') {
        return <CreateStatusScreen onBack={() => setActiveSubScreen(null)} onCreateStatus={handleCreateStatus} />;
    }

    switch (activeScreen) {
      case 'Chat':
        return <ChatListScreen onChatSelect={handleChatSelect} onNavigateToSubScreen={handleNavigateToSubScreen} onNavigate={handleNavigate} />;
      case 'Cash':
        return <WalletScreen 
                    transactions={transactions} 
                    onFundWallet={handleFundWallet}
                    onSendMoney={handleSendMoney}
                    onRequestMoney={handleRequestMoney}
                    user={currentUser} 
                />;
      case 'Task':
        return <TaskScreen />;
      case 'Settings':
         return <SettingsScreen user={currentUser} onUpdateUser={handleUpdateUser} />;
      default:
        return <ChatListScreen onChatSelect={handleChatSelect} onNavigateToSubScreen={handleNavigateToSubScreen} onNavigate={handleNavigate} />;
    }
  };

  const showBottomNav = !activeSubScreen || activeSubScreen === 'Status';

  return (
    <div className={`h-full w-full max-w-sm mx-auto bg-white flex flex-col shadow-2xl relative ${theme}`}>
      <div className="flex-grow flex flex-col min-h-0">
        {renderContent()}
      </div>
      {showBottomNav && <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;