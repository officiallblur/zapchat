
import React from 'react';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { ArrowUpRightIcon, ArrowDownLeftIcon, PlusIcon } from './icons';

interface TransactionListItemProps {
  transaction: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const { type, user, description, date, amount, currency } = transaction;

  const getIcon = () => {
    switch (type) {
      case TransactionType.SENT:
        return (
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <ArrowUpRightIcon className="w-6 h-6" />
          </div>
        );
      case TransactionType.RECEIVED:
        return (
          <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <ArrowDownLeftIcon className="w-6 h-6" />
          </div>
        );
      case TransactionType.FUNDED:
        return (
          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <PlusIcon className="w-6 h-6" />
          </div>
        );
    }
  };

  const title = user ? (type === TransactionType.SENT ? `Sent to ${user.name}` : `From ${user.name}`) : description;
  const isCredit = type === TransactionType.RECEIVED || type === TransactionType.FUNDED;
  
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl">
      {getIcon()}
      <div className="flex-grow min-w-0">
        <p className="font-bold text-gray-800 truncate">{title}</p>
        <p className="text-sm text-gray-400">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>
      <div className={`flex-shrink-0 font-bold ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
        {isCredit ? `+${formattedAmount}` : formattedAmount}
      </div>
    </div>
  );
};

export default TransactionListItem;
