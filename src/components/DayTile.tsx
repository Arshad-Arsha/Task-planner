// src/components/DayTile.tsx
import React from 'react';
import { Task } from '../types';
import { Category } from '../types';
import { format, isSameDay } from 'date-fns';
import { TaskBar } from './TaskBar';
import { getTaskPosition } from '../utils/ taskUtils';

interface DayTileProps {
  day: Date;
  tasks: Task[];
  categories: Category[];
  isToday: boolean;
  isCurrentMonth: boolean;
  isDraggedOver: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  setEditingTask: (task: Task) => void;
  setResizingTask: (data: {task: Task, edge: 'start' | 'end'} | null) => void;
}

export const DayTile: React.FC<DayTileProps> = ({
  day,
  tasks,
  categories,
  isToday,
  isCurrentMonth,
  isDraggedOver,
  onMouseDown,
  onMouseEnter,
  setEditingTask,
  setResizingTask,
}) => {
  const dayNumber = format(day, 'd');
  
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#ccc';
  };

  return (
    <div 
      className={`day-tile ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isDraggedOver ? 'dragged-over' : ''}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <div className="day-header">
        <div className="day-number">{dayNumber}</div>
      </div>
      
      <div className="tasks-container">
        {tasks.map(task => {
          // Only render the task on its first day
          if (!isSameDay(day, task.startDate)) return null;
          
          return (
            <TaskBar
              key={task.id}
              task={task}
              color={getCategoryColor(task.categoryId)}
              onEdit={() => setEditingTask(task)}
              onResizeStart={(edge) => setResizingTask({ task, edge })}
            />
          );
        })}
      </div>
    </div>
  );
};