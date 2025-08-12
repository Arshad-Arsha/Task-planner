// src/App.tsx
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { FilterPanel } from './components/FilterPanel';
import { TaskModal } from './components/TaskModal';
import { Task, Category, FilterState } from './types';
import { generateCalendar, getDaysInMonth } from './utils/calendarUtils';
import { getTasksForDay, filterTasks } from './utils/ taskUtils';
import './styles.css';

const initialCategories: Category[] = [
  { id: 'todo', name: 'To Do', color: '#FF6B6B' },
  { id: 'inprogress', name: 'In Progress', color: '#4ECDC4' },
  { id: 'review', name: 'Review', color: '#FFD166' },
  { id: 'completed', name: 'Completed', color: '#06D6A0' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Project Planning',
    startDate: new Date(2023, 8, 5),
    endDate: new Date(2023, 8, 8),
    categoryId: 'todo',
  },
  {
    id: '2',
    name: 'UI Design',
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 15),
    categoryId: 'inprogress',
  },
  {
    id: '3',
    name: 'Code Review',
    startDate: new Date(2023, 8, 18),
    endDate: new Date(2023, 8, 20),
    categoryId: 'review',
  },
  {
    id: '4',
    name: 'Deployment',
    startDate: new Date(2023, 8, 25),
    endDate: new Date(2023, 8, 27),
    categoryId: 'completed',
  },
];

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 8, 1)); // September 2023
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [categories] = useState<Category[]>(initialCategories);
  const [filters, setFilters] = useState<FilterState>({
    category: {
      todo: true,
      inprogress: true,
      review: true,
      completed: true,
    },
    duration: 'all',
    search: '',
  });

  const [draggedDays, setDraggedDays] = useState<Date[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [resizingTask, setResizingTask] = useState<{ task: Task, edge: 'start' | 'end' } | null>(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const calendarDays = generateCalendar(currentDate);

  const handleDragStart = (day: Date) => {
    setIsDragging(true);
    setDraggedDays([day]);
  };

  const handleDragOver = (day: Date) => {
    if (!isDragging || draggedDays.includes(day)) return;

    const startDate = draggedDays[0];
    const endDate = day;
    const daysInRange = getDaysInRange(startDate, endDate);

    setDraggedDays(daysInRange);
  };

  const handleDragEnd = () => {
    if (draggedDays.length > 0) {
      setIsModalOpen(true);
    }
    setIsDragging(false);
  };

  const getDaysInRange = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    let current = new Date(start);
    let endDate = new Date(end);

    if (current > endDate) {
      [current, endDate] = [endDate, current];
    }

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const createTask = (name: string, categoryId: string) => {
    if (draggedDays.length === 0) return;

    const startDate = draggedDays[0];
    const endDate = draggedDays[draggedDays.length - 1];

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name,
      startDate,
      endDate,
      categoryId,
    };

    setTasks([...tasks, newTask]);
    setDraggedDays([]);
    setIsModalOpen(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const moveTask = (taskId: string, newStartDate: Date) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const duration = Math.floor(
      (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + duration);

    const updatedTask: Task = {
      ...task,
      startDate: newStartDate,
      endDate: newEndDate,
    };

    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
  };

  const resizeTask = (taskId: string, edge: 'start' | 'end', newDate: Date) => {
    setTasks(tasks.map(task => {
      if (task.id !== taskId) return task;

      if (edge === 'start') {
        // Ensure new start date is before end date
        const endDate = newDate < task.endDate ? task.endDate : new Date(newDate);
        return { ...task, startDate: newDate, endDate };
      } else {
        // Ensure new end date is after start date
        const startDate = newDate > task.startDate ? task.startDate : new Date(newDate);
        return { ...task, startDate, endDate: newDate };
      }
    }));
  };

  const handleDragEndDnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Task move
    if (active.data.current?.type === 'task') {
      const taskId = active.id as string;
      const dayId = over.id as string;
      const date = new Date(dayId);
      moveTask(taskId, date);
    }

    // Task resize
    if (active.data.current?.type === 'resize') {
      const taskId = active.data.current.taskId;
      const edge = active.data.current.edge;
      const dayId = over.id as string;
      const date = new Date(dayId);
      resizeTask(taskId, edge, date);
    }
  };

  const filteredTasks = filterTasks(tasks, filters, categories);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEndDnd}
    >
      <div className="app">
        <div className="header">
          <h1>Productivity Planner</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
          </div>
        </div>

        <div className="main-content">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
          />

          <div className="calendar-container">
            <CalendarHeader
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />

            <CalendarGrid
              days={calendarDays}
              tasks={filteredTasks}
              categories={categories}
              draggedDays={draggedDays}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              setEditingTask={setEditingTask}
              setResizingTask={setResizingTask}
            />
          </div>
        </div>

        {(isModalOpen || editingTask || resizingTask) && (
          <TaskModal
            isOpen={isModalOpen || !!editingTask || !!resizingTask}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
              setResizingTask(null);
            }}
            onCreate={createTask}
            onUpdate={updateTask}
            categories={categories}
            initialTask={editingTask || (resizingTask ? resizingTask.task : null)}
            draggedDays={draggedDays}
            resizingEdge={resizingTask?.edge}
          />
        )}
      </div>
    </DndContext>
  );
};

export default App;