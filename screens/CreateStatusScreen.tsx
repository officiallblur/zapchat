import React, { useState, useRef, useEffect } from 'react';
import { BackIcon, SendIcon, CameraIcon, TypeIcon, ArrowPathIcon, PhotoIcon } from '../components/icons';
import type { Status } from '../types';
import { StatusType } from '../types';
import { users } from '../constants';
import { fileToBase64 } from '../utils';

interface CreateStatusScreenProps {
  onBack: () => void;
  onCreateStatus: (status: Status) => void;
}

const colorPresets = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CreateStatusScreen: React.FC<CreateStatusScreenProps> = ({ onBack, onCreateStatus }) => {
  const [statusType, setStatusType] = useState<'text' | 'media'>('media');
  
  // Text status state
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(colorPresets[0]);
  
  // Media status state
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  
  // Camera-specific state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);


  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser.");
      return;
    }

    // Pre-flight check with Permissions API for better UX
    if (navigator.permissions) {
        try {
            // FIX: Cast 'camera' to 'any' to bypass outdated TypeScript PermissionName type definition.
            const permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
            if (permissionStatus.state === 'denied') {
                setCameraError("Camera access is denied. Please enable it in your browser settings and try again.");
                return;
            }
        } catch (err) {
            console.warn("Could not query camera permission, proceeding to prompt user.", err);
        }
    }

    stopCamera();
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            setCameraError("Camera access was denied or dismissed. Please allow camera permissions in your browser settings and try again.");
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            setCameraError("No camera found on your device. Please ensure one is connected.");
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            setCameraError("The camera is currently in use by another application. Please close it and try again.");
            break;
          case 'OverconstrainedError':
          case 'ConstraintNotSatisfiedError':
            setCameraError("The camera does not meet the required technical specifications.");
            break;
          default:
            setCameraError(`An unexpected camera error occurred: ${error.name}.`);
            break;
        }
      } else {
        setCameraError("An unknown error occurred while accessing the camera.");
      }
    }
  };

  useEffect(() => {
    if (statusType === 'media' && !mediaPreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [statusType, mediaPreview]);
  
  useEffect(() => {
      if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
      }
  }, [stream]);

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      if (video.readyState < video.HAVE_ENOUGH_DATA || !video.videoWidth) {
          console.warn("Camera not ready, please wait.");
          return;
      }
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setMediaPreview(dataUrl);
        setMediaFile(null);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setCaption('');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const base64 = await fileToBase64(file);
      setMediaPreview(base64);
      stopCamera();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = () => {
    const user = users['user-me'];
    const commonStatusProps = {
      id: `status-${Date.now()}`,
      user,
      timestamp: 'Just now',
      viewed: false,
    };

    if (statusType === 'text') {
      if (!text.trim()) return;
      onCreateStatus({ ...commonStatusProps, type: StatusType.TEXT, text, backgroundColor });
    } else if (statusType === 'media' && mediaPreview) {
      const isVideo = mediaFile?.type.startsWith('video/');
      onCreateStatus({
        ...commonStatusProps,
        type: isVideo ? StatusType.VIDEO : StatusType.IMAGE,
        imageUrl: isVideo ? undefined : mediaPreview,
        videoUrl: isVideo ? mediaPreview : undefined,
        caption: caption.trim() || undefined,
      });
    }
  };

  const renderTextCreator = () => (
    <>
      <header className="bg-transparent px-4 pt-8 sm:pt-12 pb-6 flex-shrink-0 z-10 absolute top-0 left-0 right-0">
        <button onClick={onBack} className="p-2 bg-black/30 rounded-full text-white"><BackIcon className="w-6 h-6" /></button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-8 transition-colors duration-300" style={{ backgroundColor }}>
        <textarea
          placeholder="Type a status"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-transparent text-white text-3xl font-bold text-center resize-none focus:outline-none placeholder-white/70"
        />
        <div className="absolute bottom-24 flex gap-2 p-2 bg-black/20 rounded-full">
          {colorPresets.map(color => (
            <button key={color} onClick={() => setBackgroundColor(color)} className={`w-8 h-8 rounded-full transition-transform duration-200 ${backgroundColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : ''}`} style={{ backgroundColor: color }} />
          ))}
        </div>
      </main>
      <footer className="bg-white p-4 flex-shrink-0 border-t flex items-center justify-between">
         <button onClick={() => setStatusType('media')} className="p-2 rounded-full bg-gray-100"><CameraIcon className="w-6 h-6 text-gray-600" /></button>
         <button onClick={handleCreate} disabled={!text.trim()} className="bg-[#0047FF] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg disabled:bg-gray-400"><SendIcon className="w-6 h-6 -rotate-12" /></button>
      </footer>
    </>
  );

  const renderMediaCreator = () => (
    <div className="bg-black flex-grow flex flex-col justify-center items-center relative">
        {!mediaPreview ? (
            // Camera View
            <>
                {cameraError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gray-900 text-white">
                        <CameraIcon className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold">Camera Unavailable</h3>
                        <p className="text-sm text-gray-400 max-w-xs">{cameraError}</p>
                    </div>
                ) : (
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
                )}
                <canvas ref={canvasRef} className="hidden" />
                <header className="bg-transparent px-4 pt-8 sm:pt-12 pb-6 z-10 absolute top-0 left-0 right-0">
                    <button onClick={onBack} className="p-2 bg-black/30 rounded-full text-white"><BackIcon className="w-6 h-6" /></button>
                </header>
                <footer className="bg-transparent p-4 z-10 absolute bottom-0 left-0 right-0 flex items-center justify-around">
                    <button onClick={() => setStatusType('text')} className="p-3 bg-black/30 rounded-full text-white"><TypeIcon className="w-6 h-6" /></button>
                    <button 
                        onClick={cameraError ? startCamera : handleSnap} 
                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-black/30"
                        aria-label={cameraError ? 'Try again' : 'Take photo'}
                    >
                        {cameraError ? 
                            <ArrowPathIcon className="w-8 h-8 text-black" /> : 
                            <div className="w-16 h-16 rounded-full bg-white ring-2 ring-inset ring-black"></div>
                        }
                    </button>
                    <button onClick={triggerFileInput} className="p-3 bg-black/30 rounded-full text-white"><PhotoIcon className="w-6 h-6" /></button>
                </footer>
            </>
        ) : (
            // Preview View
            <>
                <header className="bg-transparent px-4 pt-8 sm:pt-12 pb-6 z-10 absolute top-0 left-0 right-0">
                    <button onClick={handleRetake} className="p-2 bg-black/30 rounded-full text-white"><ArrowPathIcon className="w-6 h-6" /></button>
                </header>
                {mediaFile?.type.startsWith('video/') ? (
                     <video src={mediaPreview} className="w-full h-auto max-h-full object-contain" controls />
                ) : (
                     <img src={mediaPreview} alt="Status preview" className="w-full h-auto max-h-full object-contain" />
                )}
                <footer className="bg-gradient-to-t from-black/70 to-transparent p-4 z-10 absolute bottom-0 left-0 right-0 flex items-center gap-2">
                    <input type="text" placeholder="Add a caption..." value={caption} onChange={e => setCaption(e.target.value)} className="flex-grow bg-white/20 text-white placeholder-gray-300 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
                    <button onClick={handleCreate} className="bg-[#0047FF] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"><SendIcon className="w-5 h-5 -rotate-12" /></button>
                </footer>
            </>
        )}
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
       {statusType === 'text' ? renderTextCreator() : renderMediaCreator()}
    </div>
  );
};

export default CreateStatusScreen;
