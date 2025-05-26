// src/components/Column.jsx
import React from 'react';
import Task from './Task';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ column, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id, // ID da coluna para ser uma área de "soltar"
  });

  // IDs das tarefas para o SortableContext
  const taskIds = tasks.map(task => task.id);

  return (
    <div className="column">
      <h3 className="column-title">{column.title}</h3>
      {/* Tornando a coluna inteira uma área de soltar primária */}
      <div
        ref={setNodeRef} // Referência para o Dnd Kit saber que esta é uma área de soltar
        className={`task-list ${isOver ? 'is-dragging-over-dndkit' : ''}`}
        style={{ minHeight: '100px' }} // Garante que haja uma área para soltar mesmo se vazia
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;