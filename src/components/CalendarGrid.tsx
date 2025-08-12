// src/components/CalendarGrid.tsx
import React from 'react';
import { DayTile } from './DayTile';
import { Task } from '../types';
import { Category } from '../types';
import { isToday, isCurrentMonth } from '../utils/calendarUtils';
import { getTasksForDay } from '../utils/ taskUtils';

interface CalendarGridProps {
  days: Date[];
  tasks: Task[];
  categories: Category[];
  draggedDays: Date[];
  onDragStart: (day: Date) => void;
  onDragOver: (day: Date) => void;
  onDragEnd: () => void;
  setEditingTask: (task: Task) => void;
  setResizingTask: (data: {task: Task, edge: 'start' | 'end'} | null) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  tasks,
  categories,
  draggedDays,
  onDragStart,
  onDragOver,
  onDragEnd,
  setEditingTask,
  setResizingTask,
}) => {
  const handleMouseDown = (day: Date) => {
    onDragStart(day);
  };

  const handleMouseEnter = (day: Date) => {
    if (draggedDays.length > 0) {
      onDragOver(day);
    }
  };

  const handleMouseUp = () => {
    onDragEnd();
  };

  return (
    <div 
      className="calendar-grid"
      onMouseUp={handleMouseUp}
    >
      {days.map((day, index) => {
        const dayTasks = getTasksForDay(tasks, day);
        const today = isToday(day);
        const currentMonth = isCurrentMonth(day, days[15]); // Middle of the month
        
        return (
          <DayTile
            key={day.toString()}
            day={day}
            tasks={dayTasks}
            categories={categories}
            isToday={today}
            isCurrentMonth={currentMonth}
            isDraggedOver={draggedDays.some(d => d.getTime() === day.getTime())}
            onMouseDown={() => handleMouseDown(day)}
            onMouseEnter={() => handleMouseEnter(day)}
            setEditingTask={setEditingTask}
            setResizingTask={setResizingTask}
          />
        );
      })}
    </div>
  );
};