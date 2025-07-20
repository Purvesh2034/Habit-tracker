import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: Date;
  completions: Record<string, boolean>; // date string -> completion status
  isArchived: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'total' | 'consistency';
  earned: boolean;
  earnedAt?: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalHabitsCompleted: number;
  longestStreak: number;
  badges: Badge[];
}

interface HabitState {
  habits: Habit[];
  userStats: UserStats;
}

type HabitAction =
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; habitId: string }
  | { type: 'TOGGLE_COMPLETION'; habitId: string; date: string }
  | { type: 'ARCHIVE_HABIT'; habitId: string }
  | { type: 'UNARCHIVE_HABIT'; habitId: string }
  | { type: 'UPDATE_STATS'; stats: UserStats }
  | { type: 'LOAD_STATE'; state: HabitState };

const defaultBadges: Badge[] = [
  {
    id: 'first-habit',
    name: 'First Step',
    description: 'Complete your first habit',
    icon: '🌱',
    requirement: 1,
    type: 'total',
    earned: false,
  },
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    earned: false,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    requirement: 7,
    type: 'streak',
    earned: false,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    requirement: 30,
    type: 'streak',
    earned: false,
  },
  {
    id: 'total-50',
    name: 'Half Century',
    description: 'Complete 50 total habits',
    icon: '💪',
    requirement: 50,
    type: 'total',
    earned: false,
  },
  {
    id: 'total-100',
    name: 'Century Club',
    description: 'Complete 100 total habits',
    icon: '🎯',
    requirement: 100,
    type: 'total',
    earned: false,
  },
];

const initialState: HabitState = {
  habits: [],
  userStats: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalHabitsCompleted: 0,
    longestStreak: 0,
    badges: [...defaultBadges],
  },
};

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.habit],
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.habitId),
      };

    case 'TOGGLE_COMPLETION': {
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === action.habitId) {
          const newCompletions = { ...habit.completions };
          if (newCompletions[action.date]) {
            delete newCompletions[action.date];
          } else {
            newCompletions[action.date] = true;
          }
          return { ...habit, completions: newCompletions };
        }
        return habit;
      });

      // Calculate new stats
      const totalCompleted = updatedHabits.reduce(
        (sum, habit) => sum + Object.keys(habit.completions).length,
        0
      );

      const longestStreak = Math.max(
        ...updatedHabits.map(habit => calculateStreak(habit.completions))
      );

      const newXp = state.userStats.xp + (state.habits.find(h => h.id === action.habitId)?.completions[action.date] ? -10 : 10);
      const newLevel = Math.floor(newXp / 100) + 1;
      const xpToNextLevel = (newLevel * 100) - newXp;

      // Check for badge achievements
      const updatedBadges = state.userStats.badges.map(badge => {
        if (badge.earned) return badge;

        let shouldEarn = false;
        if (badge.type === 'total' && totalCompleted >= badge.requirement) {
          shouldEarn = true;
        } else if (badge.type === 'streak' && longestStreak >= badge.requirement) {
          shouldEarn = true;
        }

        return shouldEarn 
          ? { ...badge, earned: true, earnedAt: new Date() }
          : badge;
      });

      return {
        ...state,
        habits: updatedHabits,
        userStats: {
          ...state.userStats,
          xp: Math.max(0, newXp),
          level: newLevel,
          xpToNextLevel,
          totalHabitsCompleted: totalCompleted,
          longestStreak,
          badges: updatedBadges,
        },
      };
    }

    case 'ARCHIVE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.habitId
            ? { ...habit, isArchived: true }
            : habit
        ),
      };

    case 'UNARCHIVE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.habitId
            ? { ...habit, isArchived: false }
            : habit
        ),
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        userStats: action.stats,
      };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

function calculateStreak(completions: Record<string, boolean>): number {
  const dates = Object.keys(completions).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]).toISOString().split('T')[0];
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (currentDate === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

interface HabitContextType {
  state: HabitState;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'isArchived'>) => void;
  deleteHabit: (habitId: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  archiveHabit: (habitId: string) => void;
  unarchiveHabit: (habitId: string) => void;
  getHabitStreak: (habitId: string) => number;
  getHabitCompletionRate: (habitId: string, days: number) => number;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('habitTracker');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.habits = parsedState.habits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
        }));
        parsedState.userStats.badges = parsedState.userStats.badges.map((badge: any) => ({
          ...badge,
          earnedAt: badge.earnedAt ? new Date(badge.earnedAt) : undefined,
        }));
        dispatch({ type: 'LOAD_STATE', state: parsedState });
      } catch (error) {
        console.error('Failed to load habit data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('habitTracker', JSON.stringify(state));
  }, [state]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'isArchived'>) => {
    const habit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completions: {},
      isArchived: false,
    };
    dispatch({ type: 'ADD_HABIT', habit });
  };

  const deleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', habitId });
  };

  const toggleCompletion = (habitId: string, date: string) => {
    dispatch({ type: 'TOGGLE_COMPLETION', habitId, date });
  };

  const archiveHabit = (habitId: string) => {
    dispatch({ type: 'ARCHIVE_HABIT', habitId });
  };

  const unarchiveHabit = (habitId: string) => {
    dispatch({ type: 'UNARCHIVE_HABIT', habitId });
  };

  const getHabitStreak = (habitId: string): number => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return calculateStreak(habit.completions);
  };

  const getHabitCompletionRate = (habitId: string, days: number): number => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    let completedDays = 0;
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        completedDays++;
      }
    }

    return Math.round((completedDays / days) * 100);
  };

  return (
    <HabitContext.Provider
      value={{
        state,
        addHabit,
        deleteHabit,
        toggleCompletion,
        archiveHabit,
        unarchiveHabit,
        getHabitStreak,
        getHabitCompletionRate,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}