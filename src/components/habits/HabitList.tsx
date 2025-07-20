import React, { useState } from 'react';
import { Plus, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHabits } from '@/contexts/HabitContext';
import { HabitCard } from './HabitCard';
import { AddHabitModal } from './AddHabitModal';

interface HabitListProps {
  showArchived?: boolean;
}

export function HabitList({ showArchived = false }: HabitListProps) {
  const { state } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

  const filteredHabits = state.habits.filter(habit => 
    showArchived ? habit.isArchived : !habit.isArchived
  );

  const displayHabits = filteredHabits.filter(habit => 
    viewMode === 'archived' ? habit.isArchived : !habit.isArchived
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Habits
          </h2>
          <p className="text-muted-foreground mt-1">
            Build better habits, one day at a time
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'active' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('active')}
          >
            Active ({state.habits.filter(h => !h.isArchived).length})
          </Button>
          <Button
            variant={viewMode === 'archived' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('archived')}
          >
            <Archive className="h-4 w-4" />
            Archived ({state.habits.filter(h => h.isArchived).length})
          </Button>
        </div>
      </div>

      {/* Add Habit Button */}
      {viewMode === 'active' && (
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          className="w-full h-14 text-base"
        >
          <Plus className="h-5 w-5" />
          Add New Habit
        </Button>
      )}

      {/* Habits Grid */}
      {displayHabits.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="space-y-4">
            {viewMode === 'active' ? (
              <>
                <div className="text-6xl">🌱</div>
                <h3 className="text-xl font-semibold">No habits yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Start your journey to a better you by creating your first habit!
                </p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  variant="default"
                  className="mt-4"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Habit
                </Button>
              </>
            ) : (
              <>
                <div className="text-6xl">📦</div>
                <h3 className="text-xl font-semibold">No archived habits</h3>
                <p className="text-muted-foreground">
                  Habits you archive will appear here
                </p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayHabits.map((habit, index) => (
            <div
              key={habit.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HabitCard habit={habit} />
            </div>
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}