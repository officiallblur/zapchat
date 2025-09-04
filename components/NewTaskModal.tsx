import React, { useState, useRef, useEffect } from 'react';
import type { Task, ChecklistItem } from '../types';
import { TaskType } from '../types';
import { CloseIcon, FileTextIcon, MicIcon, StopCircleIcon, CheckIcon, CheckSquareIcon, TrashIcon } from './icons';

interface NewTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  taskToEdit: Task | null;
}

type ActiveTab = 'text' | 'voice' | 'checklist';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onAddTask, onUpdateTask, taskToEdit }) => {
  const isEditing = !!taskToEdit;

  const [activeTab, setActiveTab] = useState<ActiveTab>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, recorded
  const [voiceDataUrl, setVoiceDataUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const parseDuration = (durationStr: string): number => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':');
    if (parts.length !== 2) return 0;
    const [mins, secs] = parts.map(Number);
    if (isNaN(mins) || isNaN(secs)) return 0;
    return (mins * 60) + secs;
  };

  useEffect(() => {
    if (isEditing) {
        setTitle(taskToEdit.title);
        setDueDate(taskToEdit.dueDate || '');
        switch(taskToEdit.type) {
            case TaskType.TEXT:
                setActiveTab('text');
                setContent(taskToEdit.content || '');
                break;
            case TaskType.VOICE_MEMO:
                setActiveTab('voice');
                setRecordingStatus('recorded');
                setDuration(parseDuration(taskToEdit.voiceDuration || '00:00'));
                setVoiceDataUrl(taskToEdit.voiceUrl || null);
                break;
            case TaskType.CHECKLIST:
                setActiveTab('checklist');
                setChecklistItems(taskToEdit.items?.map(item => item.text) || []);
                break;
        }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [taskToEdit, isEditing]);

  const handleStartRecording = async () => {
    if (isEditing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        const base64Url = await blobToBase64(blob);
        setVoiceDataUrl(base64Url);
        setRecordingStatus('recorded');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingStatus('recording');
      setDuration(0);
      timerIntervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure microphone permissions are granted.");
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  const handleAddChecklistItem = () => {
    if (newItemText.trim()) {
      setChecklistItems([...checklistItems, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleRemoveChecklistItem = (indexToRemove: number) => {
    setChecklistItems(checklistItems.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    
    const taskDueDate = dueDate || undefined;

    if (isEditing) {
        let updatedTask: Task = { ...taskToEdit, title, dueDate: taskDueDate };
        if (activeTab === 'text') {
            updatedTask.content = content;
        } else if (activeTab === 'checklist') {
            const items: ChecklistItem[] = checklistItems.map((text, index) => ({
                id: taskToEdit.items?.[index]?.id || `ci-${Date.now()}-${index}`,
                text,
                completed: taskToEdit.items?.[index]?.completed || false,
            }));
            updatedTask.items = items;
        }
        onUpdateTask(updatedTask);
    } else {
        if (activeTab === 'text') {
            if (!content.trim()) {
                alert('Please enter some content for the note.');
                return;
            }
            onAddTask({ type: TaskType.TEXT, title, content, dueDate: taskDueDate });
        } else if (activeTab === 'voice') {
            if (voiceDataUrl) {
                onAddTask({ type: TaskType.VOICE_MEMO, title, voiceUrl: voiceDataUrl, voiceDuration: formatDuration(duration), dueDate: taskDueDate });
            } else {
                alert('Please record a voice memo first.');
            }
        } else if (activeTab === 'checklist') {
            if (checklistItems.length === 0) {
                alert('Please add at least one item to the checklist.');
                return;
            }
            const items: ChecklistItem[] = checklistItems.map((text, index) => ({
                id: `ci-${Date.now()}-${index}`,
                text,
                completed: false,
            }));
            onAddTask({ type: TaskType.CHECKLIST, title, items, dueDate: taskDueDate });
        }
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 z-20 flex flex-col justify-end" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex border-b mb-4">
          <button 
            onClick={() => !isEditing && setActiveTab('text')}
            disabled={isEditing}
            className={`flex-1 py-2 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'text' ? 'border-b-2 border-[#0047FF] text-[#0047FF]' : 'text-gray-500'} ${isEditing ? 'cursor-not-allowed' : ''}`}
          >
            <FileTextIcon className="w-5 h-5"/>
            Text Note
          </button>
          <button
            onClick={() => !isEditing && setActiveTab('voice')}
            disabled={isEditing}
            className={`flex-1 py-2 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'voice' ? 'border-b-2 border-[#0047FF] text-[#0047FF]' : 'text-gray-500'} ${isEditing ? 'cursor-not-allowed' : ''}`}
          >
            <MicIcon className="w-5 h-5"/>
            Voice Memo
          </button>
          <button
            onClick={() => !isEditing && setActiveTab('checklist')}
            disabled={isEditing}
            className={`flex-1 py-2 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'checklist' ? 'border-b-2 border-[#0047FF] text-[#0047FF]' : 'text-gray-500'} ${isEditing ? 'cursor-not-allowed' : ''}`}
          >
            <CheckSquareIcon className="w-5 h-5"/>
            Checklist
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {activeTab === 'text' && (
            <textarea
              placeholder="Write your note..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          )}

          {activeTab === 'voice' && (
            <div className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg ${isEditing ? 'bg-gray-100' : ''}`}>
              {recordingStatus === 'idle' && (
                <button onClick={handleStartRecording} className="flex flex-col items-center gap-2 text-blue-500">
                  <MicIcon className="w-10 h-10" />
                  <span className="font-semibold">Tap to Record</span>
                </button>
              )}
              {recordingStatus === 'recording' && (
                <button onClick={handleStopRecording} className="flex flex-col items-center gap-2 text-red-500 animate-pulse">
                  <StopCircleIcon className="w-10 h-10" />
                  <span className="font-semibold">Recording... ({formatDuration(duration)})</span>
                </button>
              )}
              {recordingStatus === 'recorded' && (
                 <div className="w-full flex flex-col items-center gap-2 text-green-600">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-8 h-8" />
                    <span className="font-semibold">Recorded ({formatDuration(duration)})</span>
                  </div>
                  {voiceDataUrl && <audio controls src={voiceDataUrl} className="w-full mt-2" />}
                  {isEditing && <span className="text-xs text-gray-500 mt-2">(Voice memo cannot be re-recorded)</span>}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'checklist' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add checklist item..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="bg-blue-100 text-[#0047FF] font-semibold px-4 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto pr-2">
                <ul className="flex flex-col gap-2">
                  {checklistItems.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                      <span className="text-sm text-gray-700">{item}</span>
                      <button onClick={() => handleRemoveChecklistItem(index)} className="text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-[#0047FF] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 mt-2"
          >
            {isEditing ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default NewTaskModal;