import React from 'react';

interface BottomNavButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const BottomNavButton: React.FC<BottomNavButtonProps> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-red-600';
  const inactiveClasses = 'text-slate-500 hover:text-red-600';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 p-2 flex-1 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${isActive ? activeClasses : inactiveClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="text-xs font-medium">
        {label}
      </span>
    </button>
  );
};

export default BottomNavButton;