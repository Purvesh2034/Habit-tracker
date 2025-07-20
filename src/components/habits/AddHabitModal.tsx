import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHabits } from '@/contexts/HabitContext';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const habitIcons = [
  '💧', '🏃‍♂️', '📚', '🧘‍♀️', '💪', '🥗', '🌱', '✍️',
  '🎵', '🏋️‍♀️', '🚴‍♂️', '🎯', '📝', '☀️', '🌙', '🎨',
  '🧠', '💤', '🚫🚬', '🚰', '🥋', '🎭', '📱', '🌿'
];

const habitColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const { addHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎯',
    color: '#3B82F6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    addHabit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      icon: '🎯',
      color: '#3B82F6',
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create New Habit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Habit Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              required
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Why is this habit important to you?"
              rows={3}
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose an Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {habitIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`
                    aspect-square rounded-lg text-2xl hover:scale-110 transition-all duration-200
                    ${formData.icon === icon 
                      ? 'bg-primary text-primary-foreground shadow-primary' 
                      : 'bg-secondary hover:bg-secondary/80'
                    }
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose a Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {habitColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`
                    aspect-square rounded-lg transition-all duration-200 hover:scale-110
                    ${formData.color === color ? 'ring-2 ring-foreground ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-secondary/30 rounded-lg">
            <Label className="text-sm font-medium text-muted-foreground">Preview</Label>
            <div className="flex items-center gap-3 mt-2">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-soft"
                style={{ backgroundColor: formData.color + '20', color: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <div className="font-semibold">
                  {formData.name || 'Habit Name'}
                </div>
                {formData.description && (
                  <div className="text-sm text-muted-foreground">
                    {formData.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              disabled={!formData.name.trim()}
            >
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}