import React from 'react';
import { Moon, Sun, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useHabits } from '@/contexts/HabitContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { state } = useHabits();

  const completedToday = state.habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions[today] && !habit.isArchived;
  }).length;

  const totalActiveHabits = state.habits.filter(habit => !habit.isArchived).length;

  return (
    <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-primary">
              H
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Habit Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Build better habits daily
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {completedToday}/{totalActiveHabits} today
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Trophy className="h-4 w-4 text-achievement" />
              <span className="text-sm font-medium">
                Level {state.userStats.level}
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}