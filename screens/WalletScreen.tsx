import React, { useState } from 'react';
import { users } from '../constants';
import type { Transaction, User } from '../types';
import TransactionListItem from '../components/TransactionListItem';
import WalletActionModal from '../components/WalletActionModal';
import { ArrowUpIcon, ArrowDownIcon, PlusIcon, WalletIcon } from '../components/icons';

type ModalType = 'send' | 'request' | 'fund';

interface WalletScreenProps {
    transactions: Transaction[];
    user: User;
    onFundWallet: (amount: number, reference: string) => void;
    onSendMoney: (recipient: User, amount: number) => void;
    onRequestMoney: (fromUser: User, amount: number) => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ transactions, user, onFundWallet, onSendMoney, onRequestMoney }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>('send');
    
    // Calculate balance from transactions
    const balance = transactions.reduce((acc, t) => {
        if (t.type === 'received' || t.type === 'funded') {
            return acc + t.amount;
        }
        if (t.type === 'sent') {
            return acc - t.amount;
        }
        return acc;
    }, 0);

    const formattedBalance = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(balance);

    const openModal = (type: ModalType) => {
        setModalType(type);
        setIsModalOpen(true);
    };
    
    const closeModal = () => setIsModalOpen(false);
    
    const userList = Object.values(users).filter(u => u.id !== 'user-me');

  return (
    <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900 min-h-0">
      <header className="px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0">
        <div className="bg-gradient-to-br from-[#0047FF] to-[#002B99] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between h-52">
            <div>
                <p className="text-sm text-blue-200">Total Balance</p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{formattedBalance}</h1>
            </div>
            <div className="flex justify-between items-center">
                <p className="font-mono text-sm tracking-widest opacity-70">**** **** **** 1234</p>
                <WalletIcon className="w-10 h-10 text-white/50" />
            </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <button onClick={() => openModal('send')} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ArrowUpIcon className="w-6 h-6"/>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Send</span>
            </button>
            <button onClick={() => openModal('request')} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ArrowDownIcon className="w-6 h-6"/>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Request</span>
            </button>
            <button onClick={() => openModal('fund')} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <PlusIcon className="w-6 h-6"/>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fund</span>
            </button>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto px-4 pt-2 pb-20">
        <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 px-2">Transactions</h2>
        <div className="flex flex-col gap-2">
          {transactions.map(transaction => (
            <TransactionListItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <WalletActionModal 
            type={modalType} 
            onClose={closeModal}
            onSend={onSendMoney}
            onRequest={onRequestMoney}
            onFund={onFundWallet}
            users={userList}
            user={user}
        />
      )}
    </div>
  );
};

export default WalletScreen;