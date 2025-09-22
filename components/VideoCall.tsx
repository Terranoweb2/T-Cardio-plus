import React, { useEffect, useRef, useState } from 'react';
import { MicOnIcon } from './icons/MicOnIcon';
import { MicOffIcon } from './icons/MicOffIcon';
import { VideoOnIcon } from './icons/VideoOnIcon';
import { VideoOffIcon } from './icons/VideoOffIcon';
import { PhoneXMarkIcon } from './icons/PhoneXMarkIcon';

interface VideoCallProps {
  callerName: string;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ callerName, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur d'accès à la caméra/micro:", err);
        // Gérer l'erreur, par ex. afficher un message à l'utilisateur
      }
    };

    startMedia();

    return () => {
      // Nettoyer en arrêtant les pistes de la caméra/micro
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
     if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev);
    }
  };
  
  const handleEndCall = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      onEndCall();
  }

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 z-50 flex flex-col animate-fade-in">
        {/* Remote Video (Placeholder) */}
        <div className="flex-1 w-full flex items-center justify-center bg-black/50 relative">
            <div className="absolute top-4 left-4 bg-black/30 text-white text-sm px-3 py-1.5 rounded-lg">
                En communication avec {callerName}
            </div>
            <p className="text-slate-400">Vidéo du correspondant</p>
        </div>

        {/* Local Video Preview */}
        <div className="absolute bottom-24 right-4 md:bottom-28 md:right-8 h-32 w-24 md:h-48 md:w-36 rounded-lg overflow-hidden border-2 border-slate-600 shadow-xl">
             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
             {isCameraOff && <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white">Caméra coupée</div>}
        </div>

        {/* Controls */}
        <div className="w-full bg-slate-800/80 backdrop-blur-sm py-4">
            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={toggleMic}
                    className={`p-3 rounded-full transition-colors ${isMicMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    aria-label={isMicMuted ? "Activer le micro" : "Couper le micro"}
                >
                    {isMicMuted ? <MicOffIcon className="h-6 w-6" /> : <MicOnIcon className="h-6 w-6" />}
                </button>
                <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    aria-label={isCameraOff ? "Activer la caméra" : "Couper la caméra"}
                >
                    {isCameraOff ? <VideoOffIcon className="h-6 w-6" /> : <VideoOnIcon className="h-6 w-6" />}
                </button>
                 <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                    aria-label="Raccrocher"
                >
                   <PhoneXMarkIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default VideoCall;
