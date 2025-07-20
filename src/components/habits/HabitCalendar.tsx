import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits, type Habit } from '@/contexts/HabitContext';
import { cn } from '@/lib/utils';

interface HabitCalendarProps {
  habit: Habit;
  compact?: boolean;
}

export function HabitCalendar({ habit, compact = false }: HabitCalendarProps) {
  const { toggleCompletion } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    
    // Don't allow future dates
    if (date > today) return;
    
    toggleCompletion(habit.id, dateString);
  };

  const isDayCompleted = (day: number) => {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    return habit.completions[dateString] || false;
  };

  const isDayFuture = (day: number) => {
    const date = new Date(year, month, day);
    return date > today;
  };

  const isDayToday = (day: number) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{monthName}</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground text-center p-1"
            >
              {compact ? day[0] : day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isCompleted = isDayCompleted(day);
            const isFuture = isDayFuture(day);
            const isToday = isDayToday(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={isFuture}
                className={cn(
                  "aspect-square rounded-md text-sm font-medium transition-all duration-200 relative",
                  "hover:scale-110 active:scale-95",
                  isCompleted && "bg-gradient-success text-success-foreground shadow-success animate-bounce-in",
                  !isCompleted && !isFuture && "bg-secondary/50 hover:bg-secondary text-foreground",
                  isFuture && "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50",
                  isToday && !isCompleted && "ring-2 ring-primary ring-offset-1",
                  isToday && isCompleted && "ring-2 ring-success ring-offset-1"
                )}
              >
                {day}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-scale-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground justify-center pt-2 border-t">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gradient-success rounded-sm" />
          Completed
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-secondary/50 rounded-sm" />
          Pending
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-muted/30 rounded-sm" />
          Future
        </div>
      </div>
    </div>
  );
}