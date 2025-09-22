import React, { useState, useEffect } from 'react';
import { SharedFile } from '../types';
import { getFileById } from '../services/fileService';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileMessageProps {
  fileId: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileMessage: React.FC<FileMessageProps> = ({ fileId }) => {
  const [file, setFile] = useState<SharedFile | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let url: string | null = null;

    const fetchFile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const fileData = await getFileById(fileId);
        if (fileData) {
          setFile(fileData);
          url = URL.createObjectURL(fileData.fileData);
          setObjectUrl(url);
        } else {
          setError('Fichier non trouvé.');
        }
      } catch (err) {
        setError('Erreur de chargement du fichier.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [fileId]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <SpinnerIcon className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !file || !objectUrl) {
    return <div className="p-3 text-xs text-red-400">{error || 'Impossible d\'afficher le fichier.'}</div>;
  }

  const isImage = file.fileType.startsWith('image/');

  if (isImage) {
    return (
      <a href={objectUrl} target="_blank" rel="noopener noreferrer" className="block p-1">
        <img
          src={objectUrl}
          alt={file.fileName}
          className="max-w-full h-auto max-h-64 rounded-xl object-contain cursor-pointer"
        />
      </a>
    );
  }

  return (
    <a
      href={objectUrl}
      download={file.fileName}
      className="flex items-center gap-3 p-3 hover:bg-black/10 transition-colors rounded-xl"
    >
      <DocumentIcon className="h-8 w-8 flex-shrink-0 text-slate-300" />
      <div className="overflow-hidden">
        <p className="font-semibold text-sm truncate">{file.fileName}</p>
        <p className="text-xs text-slate-300">{formatBytes(file.fileSize)}</p>
      </div>
    </a>
  );
};

export default FileMessage;