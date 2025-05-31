import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getPriorityStyle = (priorityNumber) => {
  switch (priorityNumber) {
    case 1:
      return { borderLeft: '4px solid red', paddingLeft: '6px' };
    case 2:
      return { borderLeft: '4px solid orange', paddingLeft: '6px' };
    case 3:
      return { borderLeft: '4px solid green', paddingLeft: '6px' };
    default:
      return { paddingLeft: '10px' };
  }
};

const Task = ({ task, onOpenTaskModal, onToggleTaskDone, currentColumnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 3px 6px rgba(9,30,66,.35)' : '0 1px 0 rgba(9,30,66,.25)',
    ...getPriorityStyle(task.prioridade)
  };

  const handleTaskClick = (e) => {
    if (e.target.type === 'checkbox') {
      return;
    }
    if (onOpenTaskModal) {
      onOpenTaskModal(task);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onToggleTaskDone) {
      onToggleTaskDone(task); 
    }
  };

  const isTaskDone = task.check;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card-container ${isDragging ? 'is-dragging-dndkit' : ''}`}
    >
      <div className="task-card-content" {...attributes} {...listeners} onClick={handleTaskClick}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={isTaskDone}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
        <p>{task.titulo}</p> 
      </div>
    </div>
  );
};

export default Task;