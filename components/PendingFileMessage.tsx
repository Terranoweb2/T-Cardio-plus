
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface PendingFileMessageProps {
  file: File;
  status: 'sending' | 'error';
  isSender: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const PendingFileMessage: React.FC<PendingFileMessageProps> = ({ file, status, isSender }) => {
    const textColor = isSender ? 'text-slate-300' : 'text-slate-500';
    const iconColor = isSender ? 'text-slate-300' : 'text-slate-400';
    const spinnerColor = isSender ? 'text-white' : 'text-red-600';

    return (
        <div className="flex items-center gap-3 p-3">
            <div className="relative h-8 w-8 flex-shrink-0 flex items-center justify-center">
                <DocumentIcon className={`h-8 w-8 ${iconColor}`} />
                {status === 'sending' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <SpinnerIcon className={`h-5 w-5 animate-spin ${spinnerColor}`} />
                    </div>
                )}
            </div>
            <div className="overflow-hidden">
                <p className={`font-semibold text-sm truncate ${isSender ? 'text-white' : 'text-slate-800'}`}>{file.name}</p>
                <p className={`text-xs ${textColor}`}>{formatBytes(file.size)}</p>
                {status === 'error' && 
                    <div className="flex items-center gap-1 mt-0.5">
                        <ExclamationCircleIcon className="h-3.5 w-3.5 text-red-400" />
                        <p className="text-xs text-red-400">Échec de l'envoi</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default PendingFileMessage;
