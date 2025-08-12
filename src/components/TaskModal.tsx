// src/components/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Category } from '../types';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, categoryId: string) => void;
  onUpdate: (task: Task) => void;
  categories: Category[];
  initialTask: Task | null;
  draggedDays: Date[];
  resizingEdge?: 'start' | 'end';
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  categories,
  initialTask,
  draggedDays,
  resizingEdge
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  
  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name);
      setCategoryId(initialTask.categoryId);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
    }
  }, [initialTask, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialTask) {
      onUpdate({
        ...initialTask,
        name,
        categoryId
      });
    } else {
      onCreate(name, categoryId);
    }
  };

  const getDateRangeText = () => {
    if (draggedDays.length === 0 && initialTask) {
      return `${format(initialTask.startDate, 'MMM d')} - ${format(initialTask.endDate, 'MMM d')}`;
    }
    
    if (draggedDays.length > 0) {
      return `${format(draggedDays[0], 'MMM d')} - ${format(draggedDays[draggedDays.length - 1], 'MMM d')}`;
    }
    
    return '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{initialTask ? 'Edit Task' : 'Create New Task'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date Range</label>
            <div className="date-range-display">{getDateRangeText()}</div>
          </div>
          
          {resizingEdge && (
            <div className="resize-info">
              <p>Drag the task edges to adjust the duration</p>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};