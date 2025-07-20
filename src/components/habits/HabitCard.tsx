import React, { useState } from 'react';
import { MoreVertical, Calendar, Trash2, Archive, ArchiveRestore, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHabits, type Habit } from '@/contexts/HabitContext';
import { HabitCalendar } from './HabitCalendar';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { deleteHabit, archiveHabit, unarchiveHabit, getHabitStreak, getHabitCompletionRate, toggleCompletion } = useHabits();
  const [showCalendar, setShowCalendar] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions[today] || false;
  const currentStreak = getHabitStreak(habit.id);
  const completionRate = getHabitCompletionRate(habit.id, 30);

  const handleToggleToday = () => {
    toggleCompletion(habit.id, today);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabit(habit.id);
    }
  };

  const handleArchive = () => {
    if (habit.isArchived) {
      unarchiveHabit(habit.id);
    } else {
      archiveHabit(habit.id);
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 cursor-pointer",
      habit.isArchived && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-soft"
              style={{ backgroundColor: habit.color + '20', color: habit.color }}
            >
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-none">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCalendar(!showCalendar)}>
                <Calendar className="h-4 w-4" />
                {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                {habit.isArchived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-accent">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">30-day Rate</div>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-warning">
              {Object.keys(habit.completions).length}
            </div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
        </div>

        {/* Today's completion */}
        {!habit.isArchived && (
          <Button
            onClick={handleToggleToday}
            variant={isCompletedToday ? "success" : "outline"}
            className="w-full h-12"
          >
            <Target className="h-4 w-4" />
            {isCompletedToday ? "Completed Today!" : "Mark as Done Today"}
          </Button>
        )}

        {/* Streak badges */}
        {currentStreak > 0 && (
          <div className="flex gap-1 flex-wrap">
            {currentStreak >= 3 && <Badge variant="secondary" className="bg-warning/20 text-warning">🔥 3+ days</Badge>}
            {currentStreak >= 7 && <Badge variant="secondary" className="bg-success/20 text-success">⚡ 1 week</Badge>}
            {currentStreak >= 30 && <Badge variant="secondary" className="bg-achievement/20 text-achievement">🏆 1 month</Badge>}
          </div>
        )}

        {/* Calendar */}
        {showCalendar && (
          <div className="pt-4 border-t animate-fade-in">
            <HabitCalendar habit={habit} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}