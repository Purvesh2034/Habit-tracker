import React, { useState, useEffect } from 'react';
import { HabitProvider } from '@/contexts/HabitContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { HabitList } from '@/components/habits/HabitList';
import { DashboardOverview } from '@/components/overview/DashboardOverview';
import { BadgeShowcase } from '@/components/gamification/StreakBadge';
import { createDemoHabits, generateRandomCompletions } from '@/utils/demoData';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const { state, addHabit } = useHabits();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize with demo data if no habits exist
  useEffect(() => {
    if (!hasInitialized && state.habits.length === 0) {
      const demoHabits = createDemoHabits();
      
      // Add demo habits with some historical data
      demoHabits.forEach((habitData, index) => {
        const habit = {
          ...habitData,
          id: crypto.randomUUID(),
          createdAt: new Date(Date.now() - (30 - index * 5) * 24 * 60 * 60 * 1000), // Created over past 30 days
          completions: generateRandomCompletions(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
            30, 
            0.6 + index * 0.1 // Varying completion rates
          ),
          isArchived: false,
        };
        
        // Use the internal state update instead of addHabit to avoid re-triggering useEffect
        setTimeout(() => addHabit(habitData), index * 100);
      });
      
      setHasInitialized(true);
    }
  }, [state.habits.length, hasInitialized, addHabit]);

  const renderContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitList />;
      case 'overview':
        return <DashboardOverview />;
      case 'achievements':
        return <BadgeShowcase />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Analytics
              </h2>
              <p className="text-muted-foreground mt-1">
                Detailed insights into your habit progress
              </p>
            </div>
            <Card className="p-12 text-center">
              <CardContent>
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and insights are in development
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Demo Data Button - Only show if no habits exist and not initialized */}
      {!hasInitialized && state.habits.length === 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setHasInitialized(true)}
            variant="gradient"
            className="shadow-glow"
          >
            ✨ Add Demo Data
          </Button>
        </div>
      )}
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </ThemeProvider>
  );
};

export default Index;
