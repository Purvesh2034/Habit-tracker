import React, { useState } from 'react';
import { Home, Target, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigationItems: NavigationItem[] = [
  { id: 'habits', label: 'My Habits', icon: Target },
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-card/50 backdrop-blur-md border-b sticky top-[88px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex-shrink-0 rounded-none border-b-2 rounded-t-lg transition-all duration-300",
                  isActive 
                    ? "border-b-primary bg-primary/10" 
                    : "border-b-transparent hover:border-b-primary/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}