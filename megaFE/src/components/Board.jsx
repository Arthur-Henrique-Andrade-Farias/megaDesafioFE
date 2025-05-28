// src/components/Board.jsx
import React, { useState } from 'react';
import Column from './Column';
import AddColumnForm from './AddColumnForm';
import TaskDetailModal from './TaskDetailModal';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { DONE_COLUMN_ID, TODO_COLUMN_ID } from './constants'; // Importando IDs conhecidos

// Dados Iniciais (com description, priority, createdAt, dueDate)
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Configurar ambiente', description: 'Instalar Node, Yarn, configurar VSCode.', priority: 'high', createdAt: '2024-05-26T10:00:00Z', dueDate: '2024-06-10' },
    'task-2': { id: 'task-2', title: 'Estrutura de componentes', description: 'Definir componentes: Board, Column, Task.', priority: 'high', createdAt: '2024-05-27T11:00:00Z', dueDate: '2024-06-15' },
    'task-3': { id: 'task-3', title: 'Layout Board', description: 'CSS Flexbox para o quadro.', priority: 'medium', createdAt: '2024-05-28T09:30:00Z', dueDate: null },
    'task-4': { id: 'task-4', title: 'Implementar Dnd Kit', description: 'Arrastar e soltar tarefas.', priority: 'high', createdAt: '2024-05-28T14:00:00Z', dueDate: '2024-06-20' },
    'task-5': { id: 'task-5', title: 'Estilizar colunas/tarefas', description: 'Visual Trello-like.', priority: 'medium', createdAt: '2024-05-29T16:00:00Z', dueDate: null },
    'task-6': { id: 'task-6', title: 'Nova Coluna Feature', description: 'Criar colunas dinamicamente.', priority: 'low', createdAt: '2024-05-30T08:00:00Z', dueDate: '2024-07-01' },
    'task-7': { id: 'task-7', title: 'Modal de Tarefa', description: 'Edição de título, descrição, etc.', priority: 'high', createdAt: '2024-05-30T10:00:00Z', dueDate: '2024-06-25' },
    'task-8': { id: 'task-8', title: 'Testes Finais', description: 'Testar tudo.', priority: 'medium', createdAt: '2024-05-31T15:00:00Z', dueDate: null },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'Backlog', taskIds: ['task-1', 'task-2'] },
    'col-2': { id: 'col-2', title: 'To Do', taskIds: ['task-3', 'task-4'] },
    'col-3': { id: 'col-3', title: 'Doing', taskIds: ['task-5', 'task-6', 'task-7'] },
    'col-4': { id: 'col-4', title: 'Done', taskIds: ['task-8'] },
    'col-5': { id: 'col-5', title: 'Canceled', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};

const Board = () => {
  const [boardData, setBoardData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddColumn = (title) => {
    const newColumnId = 'col-' + Date.now(); // ID único simples
    const newColumn = {
      id: newColumnId,
      title,
      taskIds: [],
    };
    setBoardData(prevData => ({
      ...prevData,
      columns: { ...prevData.columns, [newColumnId]: newColumn },
      columnOrder: [...prevData.columnOrder, newColumnId],
    }));
  };

  const handleAddNewTask = (title, columnId) => {
    const newTaskId = 'task-' + Date.now();
    const newTask = {
      id: newTaskId,
      title,
      description: '',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      dueDate: null,
    };
    setBoardData(prevData => ({
      ...prevData,
      tasks: { ...prevData.tasks, [newTaskId]: newTask },
      columns: {
        ...prevData.columns,
        [columnId]: {
          ...prevData.columns[columnId],
          taskIds: [...prevData.columns[columnId].taskIds, newTaskId],
        },
      },
    }));
  };

  const findColumnIdForTask = (taskId, columns) => {
    return Object.keys(columns).find(columnId => columns[columnId].taskIds.includes(taskId));
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId && !boardData.columns[overId]) return;

    setBoardData((prev) => {
      const newBoardData = JSON.parse(JSON.stringify(prev));
      const { columns, tasks } = newBoardData;
      const activeColumnId = findColumnIdForTask(activeId, columns);
      const overIsAColumnItself = !!columns[overId];
      const overIsATask = !!tasks[overId];
      let overColumnId = overIsAColumnItself ? overId : (overIsATask ? findColumnIdForTask(overId, columns) : null);

      if (!activeColumnId || !overColumnId) {
        console.warn("DND: Coluna de origem ou destino não identificada.", { activeId, overId, activeColumnId, overColumnId });
        return prev;
      }
      
      const activeCol = columns[activeColumnId];
      const destCol = columns[overColumnId];

      if (activeColumnId === overColumnId) { // Reordenar na mesma coluna
        const oldIndex = activeCol.taskIds.indexOf(activeId);
        let newIndex = overIsATask ? destCol.taskIds.indexOf(overId) : destCol.taskIds.length;
        if (oldIndex !== -1 && newIndex !== -1) {
          activeCol.taskIds = arrayMove(activeCol.taskIds, oldIndex, newIndex);
        }
      } else { // Mover para coluna diferente
        const oldIndexInSource = activeCol.taskIds.indexOf(activeId);
        if (oldIndexInSource > -1) {
          activeCol.taskIds.splice(oldIndexInSource, 1);
        }
        let newIndexInDest = overIsATask ? destCol.taskIds.indexOf(overId) : destCol.taskIds.length;
        destCol.taskIds.splice(newIndexInDest, 0, activeId);
      }
      return newBoardData;
    });
  };

  const handleOpenTaskModal = (taskIdToEdit) => {
    const taskToEdit = boardData.tasks[taskIdToEdit];
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTaskTitle = (taskId, newTitle) => {
    setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], title: newTitle }}}));
  };

  const handleSaveTaskDescription = (taskId, newDescription) => {
    setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], description: newDescription }}}));
  };

  const handleSaveTaskPriority = (taskId, newPriority) => {
    setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], priority: newPriority }}}));
  };

  const handleSaveTaskDueDate = (taskId, newDueDate) => {
    setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], dueDate: newDueDate }}}));
  };
  
  const handleToggleTaskDone = (taskId, isCurrentlyDone) => {
    setBoardData(prevData => {
      const newBoardState = JSON.parse(JSON.stringify(prevData));
      const { columns } = newBoardState;
      const currentColumnId = findColumnIdForTask(taskId, columns);
      if (!currentColumnId) return prevData;
      const targetColumnId = isCurrentlyDone ? TODO_COLUMN_ID : DONE_COLUMN_ID;

      if (currentColumnId === targetColumnId || !columns[targetColumnId]) return prevData;
      if (columns[currentColumnId]) {
        columns[currentColumnId].taskIds = columns[currentColumnId].taskIds.filter(id => id !== taskId);
      }
      if (!columns[targetColumnId].taskIds.includes(taskId)) {
          columns[targetColumnId].taskIds.push(taskId);
      }
      return newBoardState;
    });
  };

  const handleChangeTaskColumnInModal = (taskId, oldColumnIdFromModal, newColumnId) => {
    setBoardData(prevData => {
      const task = prevData.tasks[taskId];
      if (!task) return prevData;
      const actualOldColumnId = findColumnIdForTask(taskId, prevData.columns);
      if (!newColumnId || actualOldColumnId === newColumnId) return prevData;

      const newBoardState = JSON.parse(JSON.stringify(prevData));
      if (actualOldColumnId && newBoardState.columns[actualOldColumnId]) {
        newBoardState.columns[actualOldColumnId].taskIds =
          newBoardState.columns[actualOldColumnId].taskIds.filter(id => id !== taskId);
      }
      if (newBoardState.columns[newColumnId] && !newBoardState.columns[newColumnId].taskIds.includes(taskId)) {
        newBoardState.columns[newColumnId].taskIds.push(taskId);
      }
      return newBoardState;
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="board">
          {boardData.columnOrder.map(columnId => {
            const column = boardData.columns[columnId];
            const tasksInColumn = column.taskIds
              .map(taskId => boardData.tasks[taskId])
              .filter(Boolean); // Filtra tasks undefined se um ID não existir
            
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasksInColumn}
                onOpenTaskModal={handleOpenTaskModal}
                onToggleTaskDone={handleToggleTaskDone}
                onAddNewTask={handleAddNewTask}
              />
            );
          })}
          <AddColumnForm onAddColumn={handleAddColumn} />
        </div>
      </DndContext>

      {isModalOpen && editingTask && (
        <TaskDetailModal
          task={editingTask}
          allColumns={boardData.columns}
          columnOrder={boardData.columnOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveTitle={handleSaveTaskTitle}
          onSaveDescription={handleSaveTaskDescription} 
          onSavePriority={handleSaveTaskPriority}       
          onChangeColumn={handleChangeTaskColumnInModal}
          onSaveDueDate={handleSaveTaskDueDate}
        />
      )}
    </>
  );
};

export default Board;