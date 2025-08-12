// src/components/TaskBar.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../types';
import { FaGripLines } from 'react-icons/fa';

interface TaskBarProps {
  task: Task;
  color: string;
  onEdit: () => void;
  onResizeStart: (edge: 'start' | 'end') => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ 
  task, 
  color, 
  onEdit,
  onResizeStart
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { type: 'task', task }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      className="task-bar"
      ref={setNodeRef}
      style={{ 
        backgroundColor: color,
        ...style 
      }}
      onClick={onEdit}
    >
      <div 
        className="drag-handle"
        {...listeners}
        {...attributes}
      >
        <FaGripLines />
      </div>
      
      <div className="task-name">{task.name}</div>
      
      <div 
        className="resize-handle left"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart('start');
        }}
      />
      
      <div 
        className="resize-handle right"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart('end');
        }}
      />
    </div>
  );
};