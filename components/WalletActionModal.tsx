import React, { useState } from 'react';
import type { User } from '../types';
import { CloseIcon } from './icons';
import { PAYSTACK_PUBLIC_KEY } from '../constants';

// Let TypeScript know about the PaystackPop object from the script tag
declare var PaystackPop: any;

interface WalletActionModalProps {
  type: 'send' | 'request' | 'fund';
  onClose: () => void;
  onSend: (recipient: User, amount: number) => void;
  onRequest: (user: User, amount: number) => void;
  onFund: (amount: number, reference: string) => void;
  users: User[];
  user: User; // Current user
}

const WalletActionModal: React.FC<WalletActionModalProps> = ({ type, onClose, onSend, onRequest, onFund, users, user }) => {
  const [amount, setAmount] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');

  const getTitle = () => {
    switch (type) {
      case 'send': return 'Send Money';
      case 'request': return 'Request Money';
      case 'fund': return 'Fund Wallet';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (type === 'fund') {
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email || 'customer@example.com', // User's email
        amount: numericAmount * 100, // Amount in Kobo
        ref: `chitchat_fund_${Date.now()}`,
        callback: (response: { reference: string }) => {
          // Payment successful
          onFund(numericAmount, response.reference);
          onClose(); // Close our modal
        },
        onClose: () => {
          // User closed the popup
          console.log('Paystack payment modal closed by user.');
        }
      });
      handler.openIframe();
      return;
    }
    
    switch (type) {
      case 'send': {
        const recipient = users.find(u => u.id === selectedUserId);
        if (recipient) {
            onSend(recipient, numericAmount);
            onClose();
        }
        break;
      }
      case 'request': {
        const fromUser = users.find(u => u.id === selectedUserId);
        if (fromUser) {
            onRequest(fromUser, numericAmount);
            onClose();
        }
        break;
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-40 z-30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {(type === 'send' || type === 'request') && (
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'send' ? 'Recipient' : 'From'}
              </label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (NGN)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0047FF] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 mt-2"
          >
            {type === 'fund' ? 'Pay with Paystack' : getTitle()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletActionModal;