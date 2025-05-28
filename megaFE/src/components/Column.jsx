// src/components/Column.jsx
import React from 'react';
import Task from './Task';
import AddTaskForm from './AddTaskForm'; // <<< Importe o AddTaskForm
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { DONE_COLUMN_ID } from './constants'; // Importando para passar ao Task

// Adicione onAddNewTask e onToggleTaskDone às props
const Column = ({ column, tasks, onOpenTaskModal, onToggleTaskDone, onAddNewTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map(task => task.id);

  // Handler para chamar a função do Board quando uma tarefa é adicionada nesta coluna
  const handleAddTaskToColumn = (taskTitle) => {
    if (onAddNewTask) {
      onAddNewTask(taskTitle, column.id); // Passa o título da tarefa e o ID desta coluna
    }
  };

  return (
    <div className="column">
      <h3 className="column-title">{column.title}</h3>
      <div
        ref={setNodeRef}
        className={`task-list ${isOver ? 'is-dragging-over-dndkit' : ''}`}
        // style={{ minHeight: '100px' }} // O padding e o min-height do task-list no CSS devem ajudar
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onOpenTaskModal={onOpenTaskModal}
              onToggleTaskDone={onToggleTaskDone}
              currentColumnId={column.id} // Passa o ID da coluna atual para o Task
            />
          ))}
        </SortableContext>
      </div>
      {/* Renderiza o formulário para adicionar nova tarefa aqui */}
      <AddTaskForm columnId={column.id} onAddTask={handleAddTaskToColumn} />
    </div>
  );
};

export default Column;