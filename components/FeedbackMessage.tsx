
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface FeedbackMessageProps {
  message: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl shadow-sm transition-opacity duration-300"
      role="alert"
    >
      <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default FeedbackMessage;
