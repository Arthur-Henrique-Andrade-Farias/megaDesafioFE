// src/components/Task.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id }); // O ID aqui deve ser o ID da tarefa

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 3px 6px rgba(9,30,66,.35)' : '0 1px 0 rgba(9,30,66,.25)',
    cursor: 'grab', // Mudar para 'grabbing' via CSS se isDragging for true
  };

  const openTaskDetails = () => {
    alert(`Tarefa clicada: ${task.title}\nID: ${task.id}\n\n(Aqui você implementaria um modal)`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // Listeners para iniciar o arraste
      className={`task-card ${isDragging ? 'is-dragging-dndkit' : ''}`}
      onClick={openTaskDetails}
    >
      <p>{task.title}</p>
    </div>
  );
};

export default Task;