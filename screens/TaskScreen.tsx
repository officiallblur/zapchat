import React, { useState } from 'react';
import { MOCK_TASKS } from '../constants';
import type { Task } from '../types';
import { PlusIcon, SearchIcon } from '../components/icons';
import TaskItem from '../components/TaskItem';
import NewTaskModal from '../components/NewTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

type SortByType = 'createdAt' | 'dueDate';

const TaskScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('createdAt');

  const handleOpenAddNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleEditFromDetail = (task: Task) => {
    setViewingTask(null);
    handleStartEdit(task);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [task, ...prevTasks]);
    handleCloseModal();
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    handleCloseModal();
  };

  const sortedAndFilteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Default: createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="flex flex-col flex-grow bg-gray-100 min-h-0">
      <header className="bg-white px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">My Tasks</h1>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search tasks"
          />
        </div>
        <div className="flex justify-end mt-4">
          <div className="bg-gray-200 p-1 rounded-full flex text-sm font-semibold text-gray-600">
            <button
                onClick={() => setSortBy('createdAt')}
                className={`px-4 py-1 rounded-full transition-all duration-200 ${sortBy === 'createdAt' ? 'bg-white shadow text-blue-600' : 'hover:bg-gray-300'}`}
                aria-pressed={sortBy === 'createdAt'}
            >
                By Creation
            </button>
            <button
                onClick={() => setSortBy('dueDate')}
                className={`px-4 py-1 rounded-full transition-all duration-200 ${sortBy === 'dueDate' ? 'bg-white shadow text-blue-600' : 'hover:bg-gray-300'}`}
                aria-pressed={sortBy === 'dueDate'}
            >
                By Due Date
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto px-6 pt-6 pb-24">
        {sortedAndFilteredTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedAndFilteredTasks.map(task => (
              <button key={task.id} onClick={() => setViewingTask(task)} className="text-left">
                <TaskItem task={task} />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="font-semibold text-lg">No tasks found</p>
            <p className="text-sm">Try a different search term or clear your filters.</p>
          </div>
        )}
      </main>

      <div className="absolute bottom-24 right-6">
        <button 
          onClick={handleOpenAddNew}
          className="bg-[#0047FF] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Add new task"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      </div>

      {isModalOpen && (
        <NewTaskModal 
          onClose={handleCloseModal} 
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          taskToEdit={editingTask}
        />
      )}

      {viewingTask && (
        <TaskDetailModal
            task={viewingTask}
            onClose={() => setViewingTask(null)}
            onEdit={() => handleEditFromDetail(viewingTask)}
        />
      )}
    </div>
  );
};

export default TaskScreen;