import { Habit } from '@/contexts/HabitContext';

export function createDemoHabits(): Omit<Habit, 'id' | 'createdAt' | 'completions' | 'isArchived'>[] {
  return [
    {
      name: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day for better health',
      icon: '💧',
      color: '#06B6D4',
    },
    {
      name: 'Morning Exercise',
      description: '30 minutes of physical activity to start the day',
      icon: '🏃‍♂️',
      color: '#10B981',
    },
    {
      name: 'Read for 30 Minutes',
      description: 'Reading helps expand knowledge and improve focus',
      icon: '📚',
      color: '#8B5CF6',
    },
    {
      name: 'Meditate',
      description: 'Daily meditation for mental clarity and peace',
      icon: '🧘‍♀️',
      color: '#F59E0B',
    },
    {
      name: 'Practice Gratitude',
      description: 'Write down 3 things I am grateful for',
      icon: '🙏',
      color: '#EC4899',
    },
  ];
}

export function generateRandomCompletions(startDate: Date, days: number, completionRate: number = 0.7): Record<string, boolean> {
  const completions: Record<string, boolean> = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Don't generate completions for future dates
    if (date > new Date()) break;
    
    const dateString = date.toISOString().split('T')[0];
    
    // Random completion based on completion rate
    if (Math.random() < completionRate) {
      completions[dateString] = true;
    }
  }
  
  return completions;
}