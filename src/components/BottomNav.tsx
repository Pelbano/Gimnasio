import React from 'react';
import { Home, Dumbbell, BarChart2, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all",
      isActive ? "text-indigo-400" : "text-slate-500"
    )}
  >
    <div className={cn(
      "w-12 h-7 flex items-center justify-center rounded-full transition-all",
      isActive ? "bg-indigo-500/20" : "bg-transparent"
    )}>
      <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
    </div>
    <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "opacity-100" : "opacity-60")}>{label}</span>
  </button>
);

export const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2B2930] border-t border-slate-800 flex justify-around items-center px-4 pt-3 pb-safe z-50">
      <NavItem icon={Home} label="Inicio" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
      <NavItem icon={Dumbbell} label="Historial" isActive={activeTab === 'workouts'} onClick={() => onTabChange('workouts')} />
      <NavItem icon={BarChart2} label="Evolución" isActive={activeTab === 'progress'} onClick={() => onTabChange('progress')} />
      <NavItem icon={User} label="Perfil" isActive={activeTab === 'profile'} onClick={() => onTabChange('profile')} />
    </nav>
  );
};
