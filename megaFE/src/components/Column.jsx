import React from 'react';
import Task from './Task';
import AddTaskForm from './AddTaskForm';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ column, tasks, onOpenTaskModal, onToggleTaskDone, onAddNewTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIdsForSortableContext = tasks.map(task => String(task.id));

  return (
    <div className="column">
      <h3 className="column-title">{column.title} ({tasks.length})</h3>
      <div
        ref={setNodeRef}
        className={`task-list ${isOver ? 'is-dragging-over-dndkit' : ''}`}
      >
        <SortableContext items={taskIdsForSortableContext} strategy={verticalListSortingStrategy}>
          {tasks.map((apiTask) => (
            <Task
              key={apiTask.id}
              task={apiTask} 
              onOpenTaskModal={onOpenTaskModal}
              onToggleTaskDone={onToggleTaskDone}
              currentColumnId={column.id}
            />
          ))}
        </SortableContext>
      </div>
      <AddTaskForm columnId={column.id} onAddTask={onAddNewTask} />
    </div>
  );
};

export default Column;