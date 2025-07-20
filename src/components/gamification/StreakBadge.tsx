import React from 'react';
import { Award, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHabits, type Badge as BadgeType } from '@/contexts/HabitContext';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  badge: BadgeType;
  className?: string;
}

export function StreakBadge({ badge, className }: StreakBadgeProps) {
  const earnedDate = badge.earnedAt?.toLocaleDateString();

  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-105",
      badge.earned 
        ? "bg-gradient-achievement text-achievement-foreground shadow-lg animate-bounce-in" 
        : "bg-muted/50 opacity-60",
      className
    )}>
      <CardContent className="p-4 text-center space-y-3">
        {/* Icon */}
        <div className="relative">
          <div className={cn(
            "text-4xl mx-auto w-16 h-16 rounded-full flex items-center justify-center",
            badge.earned 
              ? "bg-achievement-foreground/20" 
              : "bg-muted"
          )}>
            {badge.earned ? badge.icon : <Lock className="h-6 w-6" />}
          </div>
          {badge.earned && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Award className="h-3 w-3 text-success-foreground" />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-bold text-lg">{badge.name}</h3>
          <p className={cn(
            "text-sm",
            badge.earned ? "text-achievement-foreground/80" : "text-muted-foreground"
          )}>
            {badge.description}
          </p>
        </div>

        {/* Progress/Status */}
        <div className="space-y-2">
          <Badge 
            variant={badge.earned ? "default" : "secondary"}
            className={cn(
              badge.earned && "bg-achievement-foreground/20 text-achievement-foreground"
            )}
          >
            {badge.type === 'streak' && `${badge.requirement} day streak`}
            {badge.type === 'total' && `${badge.requirement} completions`}
            {badge.type === 'consistency' && `${badge.requirement}% consistency`}
          </Badge>
          
          {badge.earned && earnedDate && (
            <div className="text-xs opacity-80">
              Earned {earnedDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BadgeShowcase() {
  const { state } = useHabits();
  const { badges } = state.userStats;

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Achievements</h2>
        <p className="text-muted-foreground">
          Complete habits and build streaks to unlock badges!
        </p>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-success">
            🏆 Unlocked ({earnedBadges.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge, index) => (
              <div
                key={badge.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StreakBadge badge={badge} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-muted-foreground">
          🔒 Locked ({unearnedBadges.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {unearnedBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(earnedBadges.length + index) * 100}ms` }}
            >
              <StreakBadge badge={badge} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}