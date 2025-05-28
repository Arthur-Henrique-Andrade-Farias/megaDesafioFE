// src/components/Task.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DONE_COLUMN_ID } from './constants'; // <--- ADICIONE ESTA LINHA (ajuste o caminho se necessário)

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'high':
      return { borderLeft: '4px solid red', paddingLeft: '6px' };
    case 'medium':
      return { borderLeft: '4px solid orange', paddingLeft: '6px' };
    case 'low':
      return { borderLeft: '4px solid green', paddingLeft: '6px' };
    default:
      // Mantém um padding consistente mesmo sem prioridade definida,
      // para que o checkbox não fique colado na borda se não houver prioridade.
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
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 3px 6px rgba(9,30,66,.35)' : '0 1px 0 rgba(9,30,66,.25)',
    // O cursor 'grab' é aplicado via CSS em .task-card-content, e o Dnd Kit lida com o cursor durante o arraste.
    ...getPriorityStyle(task.priority)
  };

  const handleTaskClick = (e) => {
    // Evita abrir o modal se o clique foi no checkbox
    if (e.target.type === 'checkbox') {
      return;
    }
    if (onOpenTaskModal) {
      onOpenTaskModal(task.id);
    } else {
      // Este alert não deve mais aparecer se a prop onOpenTaskModal for passada corretamente
      console.warn("onOpenTaskModal não foi fornecida para a Task:", task.title);
      alert(`Tarefa clicada: ${task.title}\nID: ${task.id}`);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // Impede que o clique no checkbox também acione handleTaskClick
    if (onToggleTaskDone) {
      // Agora DONE_COLUMN_ID vem da importação
      onToggleTaskDone(task.id, currentColumnId === DONE_COLUMN_ID);
    }
  };

  // Agora isTaskDone usa o DONE_COLUMN_ID importado
  const isTaskDone = currentColumnId === DONE_COLUMN_ID;

  return (
    <div
      ref={setNodeRef}
      style={style} // Aplica o estilo que inclui a borda de prioridade
      className={`task-card-container ${isDragging ? 'is-dragging-dndkit' : ''}`}
    >
      {/* Aplicamos os listeners de arrastar e o onClick para abrir modal no div interno */}
      <div className="task-card-content" {...attributes} {...listeners} onClick={handleTaskClick}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={isTaskDone}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()} // Garante que o clique no checkbox não propague
        />
        <p>{task.title}</p>
      </div>
    </div>
  );
};

export default Task;