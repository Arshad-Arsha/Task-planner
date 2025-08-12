// src/utils/taskUtils.ts
import { Task, Category, FilterState } from '../types';
import { differenceInDays, addDays, isWithinInterval } from 'date-fns';

export const getTasksForDay = (tasks: Task[], day: Date): Task[] => {
  return tasks.filter(task => {
    return day >= task.startDate && day <= task.endDate;
  });
};

export const filterTasks = (
  tasks: Task[], 
  filters: FilterState, 
  categories: Category[]
): Task[] => {
  return tasks.filter(task => {
    // Category filter
    if (!filters.category[task.categoryId]) return false;
    
    // Search filter
    if (filters.search && !task.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Duration filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filters.duration !== 'all') {
      let days = 7;
      if (filters.duration === '2weeks') days = 14;
      if (filters.duration === '3weeks') days = 21;
      
      const endDate = addDays(today, days);
      
      const taskInterval = {
        start: task.startDate,
        end: task.endDate
      };
      
      if (!isWithinInterval(today, taskInterval)) {
        const taskStartAfterToday = task.startDate >= today;
        const taskEndsWithinRange = task.endDate <= endDate;
        
        if (!taskStartAfterToday || !taskEndsWithinRange) {
          return false;
        }
      }
    }
    
    return true;
  });
};

export const getTaskPosition = (task: Task, day: Date, days: Date[]): { width: number, offset: number } => {
  const taskStartIndex = days.findIndex(d => d.getTime() === task.startDate.getTime());
  const taskEndIndex = days.findIndex(d => d.getTime() === task.endDate.getTime());
  
  if (taskStartIndex === -1 || taskEndIndex === -1) {
    return { width: 0, offset: 0 };
  }
  
  const dayIndex = days.findIndex(d => d.getTime() === day.getTime());
  
  if (dayIndex < taskStartIndex || dayIndex > taskEndIndex) {
    return { width: 0, offset: 0 };
  }
  
  const width = (taskEndIndex - taskStartIndex + 1) * 100;
  const offset = (dayIndex - taskStartIndex) * 100;
  
  return { width, offset };
};