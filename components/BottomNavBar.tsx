import React from 'react';
import BottomNavButton from './BottomNavButton';

type TabId = 'accueil' | 'historique' | 'profil' | 'teleconsultation' | 'messagerie' | 'rappels' | 'chatbot';

interface TabInfo {
  id: TabId;
  label: string;
  icon: React.ReactElement;
}

interface BottomNavBarProps {
  tabs: TabInfo[];
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-40">
      <div className="flex justify-around items-center max-w-4xl mx-auto px-1 py-1 sm:px-2">
        {tabs.map((tab) => (
          <BottomNavButton
            key={tab.id}
            label={tab.label}
            // Larger icons for better touch interaction on mobile
            // FIX: Cast the icon to a more specific ReactElement type to resolve the TypeScript overload error.
            // This explicitly tells TypeScript that the icon element is guaranteed to accept a 'className' prop.
            icon={React.cloneElement(tab.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
