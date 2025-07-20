import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHabits } from '@/contexts/HabitContext';

export function ProgressBar() {
  const { state } = useHabits();
  const { userStats } = state;

  const progressPercentage = Math.round((userStats.xp / (userStats.level * 100)) * 100);

  return (
    <Card className="bg-gradient-primary text-primary-foreground shadow-primary border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Level {userStats.level}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{userStats.xp} XP</span>
            <span>{userStats.level * 100} XP</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-primary-foreground/20"
          />
          <div className="text-xs text-primary-foreground/80">
            {userStats.xpToNextLevel} XP to next level
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.totalHabitsCompleted}</div>
            <div className="text-xs text-primary-foreground/80">Total Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.longestStreak}</div>
            <div className="text-xs text-primary-foreground/80">Longest Streak</div>
          </div>
        </div>

        {/* Recent Achievements */}
        {userStats.badges.some(badge => badge.earned) && (
          <div className="pt-2 border-t border-primary-foreground/20">
            <div className="text-sm font-medium mb-2">Recent Achievements</div>
            <div className="flex gap-1 flex-wrap">
              {userStats.badges
                .filter(badge => badge.earned)
                .slice(-3)
                .map(badge => (
                  <Badge
                    key={badge.id}
                    variant="secondary"
                    className="bg-primary-foreground/20 text-primary-foreground border-0"
                  >
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}