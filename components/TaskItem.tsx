import React from 'react';
import type { Task } from '../types';
import { TaskType } from '../types';
import { FileTextIcon, MicIcon, CheckSquareIcon, PlayIcon, CalendarIcon } from './icons';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const getIcon = () => {
    switch (task.type) {
      case TaskType.TEXT:
        return <FileTextIcon className="w-6 h-6 text-blue-500" />;
      case TaskType.VOICE_MEMO:
        return <MicIcon className="w-6 h-6 text-red-500" />;
      case TaskType.CHECKLIST:
        return <CheckSquareIcon className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (task.type) {
      case TaskType.TEXT:
        return <p className="text-sm text-gray-500 truncate">{task.content}</p>;
      case TaskType.VOICE_MEMO:
        return (
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full text-gray-600 hover:bg-gray-200">
                <PlayIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-mono text-gray-500">{task.voiceDuration}</span>
          </div>
        );
      case TaskType.CHECKLIST:
        const completedItems = task.items?.filter(item => item.completed).length || 0;
        const totalItems = task.items?.length || 0;
        return (
            <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}></div>
                </div>
                <span className="text-xs font-semibold text-gray-500">{completedItems}/{totalItems}</span>
            </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC' // To avoid timezone issues
    });
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm w-full">
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-gray-800 truncate">{task.title}</p>
        {renderContent()}
        {task.dueDate && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
