import React from 'react';
import { Calendar, Target, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/contexts/HabitContext';
import { ProgressBar } from '@/components/gamification/ProgressBar';

export function DashboardOverview() {
  const { state } = useHabits();

  const today = new Date().toISOString().split('T')[0];
  const activeHabits = state.habits.filter(h => !h.isArchived);
  const completedToday = activeHabits.filter(h => h.completions[today]).length;
  const totalEarnedBadges = state.userStats.badges.filter(b => b.earned).length;

  // Calculate week completion rate
  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    weekDates.push(date.toISOString().split('T')[0]);
  }

  const weeklyCompletions = weekDates.map(date => 
    activeHabits.filter(habit => habit.completions[date]).length
  );

  const weeklyTotal = weeklyCompletions.reduce((sum, day) => sum + day, 0);
  const weeklyPossible = activeHabits.length * 7;
  const weeklyRate = weeklyPossible > 0 ? Math.round((weeklyTotal / weeklyPossible) * 100) : 0;

  // Get current streaks
  const currentStreaks = activeHabits.map(habit => {
    const dates = Object.keys(habit.completions).sort().reverse();
    let streak = 0;
    
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
    
    return { name: habit.name, streak, icon: habit.icon };
  }).filter(h => h.streak > 0).sort((a, b) => b.streak - a.streak);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground mt-1">
          Track your progress and stay motivated
        </p>
      </div>

      {/* Progress Card */}
      <ProgressBar />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Progress */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {completedToday}/{activeHabits.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeHabits.length > 0 
                ? `${Math.round((completedToday / activeHabits.length) * 100)}% completed`
                : 'No active habits'
              }
            </p>
          </CardContent>
        </Card>

        {/* Active Habits */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {activeHabits.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Building better habits
            </p>
          </CardContent>
        </Card>

        {/* Weekly Success Rate */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">7-Day Success</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {weeklyRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyTotal}/{weeklyPossible} completions
            </p>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-achievement">
              {totalEarnedBadges}
            </div>
            <p className="text-xs text-muted-foreground">
              {state.userStats.badges.length - totalEarnedBadges} more to unlock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Streaks */}
      {currentStreaks.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔥 Current Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {currentStreaks.slice(0, 6).map((streak, index) => (
                <div
                  key={streak.name}
                  className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl">{streak.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{streak.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {streak.streak} day{streak.streak !== 1 ? 's' : ''} streak
                    </div>
                  </div>
                  <div className="ml-auto text-lg font-bold text-warning">
                    {streak.streak}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weekDates.map((date, index) => {
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const completions = weeklyCompletions[index];
              const percentage = activeHabits.length > 0 ? (completions / activeHabits.length) * 100 : 0;
              
              return (
                <div key={date} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-muted-foreground">
                    {dayName}
                  </div>
                  <div className="flex-1 bg-secondary/30 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-success transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {completions > 0 && (
                        <span className="text-xs font-medium text-success-foreground">
                          {completions}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-muted-foreground">
                    {completions}/{activeHabits.length}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}