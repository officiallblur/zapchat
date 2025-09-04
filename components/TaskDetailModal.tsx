import React from 'react';
import type { Task, ChecklistItem } from '../types';
import { TaskType } from '../types';
import { CloseIcon, EditIcon, CheckIcon, CalendarIcon } from './icons';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC' // To avoid timezone issues
    });
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onEdit }) => {
  const renderContent = () => {
    switch (task.type) {
      case TaskType.TEXT:
        return (
          <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg whitespace-pre-wrap">
            {task.content}
          </p>
        );
      case TaskType.VOICE_MEMO:
        return (
            <div className="bg-gray-100 p-3 rounded-lg">
                <audio controls src={task.voiceUrl} className="w-full">
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
      case TaskType.CHECKLIST:
        return (
          <ul className="flex flex-col gap-2">
            {task.items?.map((item: ChecklistItem) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${item.completed ? 'bg-blue-500 border-blue-500' : 'border border-gray-300'}`}>
                    {item.completed && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-40 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 break-words pr-4">{task.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-4 border-b pb-4">
             {task.dueDate && (
                <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                </div>
            )}
             <div className="flex items-center gap-1.5">
                <span className="font-semibold">Created:</span>
                <span>{formatDate(task.createdAt)}</span>
             </div>
        </div>

        <div className="mb-6 max-h-60 overflow-y-auto pr-2">
            {renderContent()}
        </div>
        
        <button
          onClick={onEdit}
          className="w-full bg-blue-100 text-[#0047FF] font-bold py-3 px-4 rounded-md hover:bg-blue-200 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <EditIcon className="w-5 h-5" />
          Edit Task
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;