// src/components/Board.jsx
import React, { useState } from 'react';
import Column from './Column';
import {
  DndContext,
  closestCenter, // ou closestCorners, rectIntersection etc.
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Seus initialData aqui (como definido antes)
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Configurar ambiente de desenvolvimento' },
    'task-2': { id: 'task-2', title: 'Definir estrutura de componentes' },
    'task-3': { id: 'task-3', title: 'Criar componente Board (React)' },
    'task-4': { id: 'task-4', title: 'Criar componente Column (React)' },
    'task-5': { id: 'task-5', title: 'Estilizar colunas e tarefas (CSS)' },
    'task-6': { id: 'task-6', title: 'Testar layout inicial e responsividade' },
    'task-7': { id: 'task-7', title: 'Revisar requisitos antigos do projeto' },
    'task-8': { id: 'task-8', title: 'Implementar DND para tarefas com Dnd Kit' },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'Backlog', taskIds: ['task-1', 'task-2'] },
    'col-2': { id: 'col-2', title: 'To Do', taskIds: ['task-3', 'task-4'] },
    'col-3': { id: 'col-3', title: 'Doing', taskIds: ['task-5', 'task-8'] },
    'col-4': { id: 'col-4', title: 'Done', taskIds: ['task-6'] },
    'col-5': { id: 'col-5', title: 'Canceled', taskIds: ['task-7'] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};

const Board = () => {
  const [boardData, setBoardData] = useState(initialData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // O usuário precisa mover 8px para iniciar o arraste
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return; // Soltou fora de uma área válida

    const activeId = active.id; // ID da tarefa arrastada
    const overId = over.id;   // ID da área onde foi solta (pode ser outra tarefa ou uma coluna)

    if (activeId === overId) return; // Soltou no mesmo lugar

    setBoardData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy para evitar mutação
      const { tasks, columns } = newData;

      const sourceColumnId = findColumnContainingTask(activeId, columns);
      let destinationColumnId = findColumnContainingTask(overId, columns);

      if (!sourceColumnId) return prevData; // Não deveria acontecer

      // Se 'overId' é uma coluna diretamente, então a tarefa está sendo movida para essa coluna
      if (columns[overId]) {
        destinationColumnId = overId;
      } else if (!destinationColumnId) {
      // Se 'overId' é uma tarefa, mas não encontramos sua coluna (improvável se a estrutura estiver correta)
      // ou se 'overId' não for uma coluna, precisamos determinar a coluna de destino.
      // Isso pode acontecer se a tarefa for solta em uma área vazia de uma coluna que não tem tarefas ainda.
      // Para este cenário, Dnd Kit `over.data.current.sortable.containerId` pode ser útil se `over` for uma área sortable.
      // Para simplificar, se over.id for uma tarefa, destinationColumnId já foi encontrado.
      // Se over.id for o ID de uma coluna (porque a coluna é um Droppable), usamos isso.
        const overIsColumn = Object.keys(columns).includes(overId);
        if (overIsColumn) {
            destinationColumnId = overId;
        } else {
            // Fallback: se não for nem tarefa nem coluna conhecida, não faz nada.
            // Em uma implementação mais robusta, você pode querer iterar para encontrar
            // a coluna mais próxima ou usar dados do `over.data` se disponíveis.
            console.warn("Não foi possível determinar a coluna de destino para:", overId);
            return prevData;
        }
      }
      

      const sourceColumn = columns[sourceColumnId];
      const destinationColumn = columns[destinationColumnId];

      const sourceTaskIndex = sourceColumn.taskIds.indexOf(activeId);
      
      // Remove da coluna de origem
      sourceColumn.taskIds.splice(sourceTaskIndex, 1);

      if (sourceColumnId === destinationColumnId) { // Mesma coluna
        destinationColumn.taskIds.splice(findNewIndex(overId, destinationColumn.taskIds, tasks, activeId, event), 0, activeId);
      } else { // Colunas diferentes
         // Adiciona à coluna de destino
        // Se soltar sobre uma tarefa, calcula o novo índice. Se soltar sobre a coluna, adiciona ao final.
        let destTaskIndex = destinationColumn.taskIds.length; // Padrão: adicionar ao final
        if (tasks[overId] && destinationColumn.taskIds.includes(overId)) { // Se soltou sobre uma tarefa existente na coluna de destino
            destTaskIndex = destinationColumn.taskIds.indexOf(overId);
            // Se a tarefa ativa está sendo arrastada para baixo sobre outra tarefa
            if (event.delta.y > 0) destTaskIndex++;

        } else if (!tasks[overId] && columns[overId]){ // Se soltou diretamente na área da coluna
             // Adicionar ao final ou ao início dependendo da lógica.
             // Para este exemplo, adicionar ao final é mais simples se não houver tarefas para determinar a posição.
        }


        destinationColumn.taskIds.splice(destTaskIndex, 0, activeId);
      }
      return newData;
    });
  };

  // Função auxiliar para encontrar a coluna que contém uma tarefa
  const findColumnContainingTask = (taskId, columns) => {
    for (const columnId in columns) {
      if (columns[columnId].taskIds.includes(taskId)) {
        return columnId;
      }
    }
    return null; // Se a tarefa não for encontrada em nenhuma coluna (deve ser tratada)
  };

  // Função auxiliar para determinar o novo índice ao soltar sobre uma tarefa
  // Esta é uma lógica simplificada; Dnd Kit pode oferecer maneiras mais diretas
  const findNewIndex = (overId, taskIdsInColumn, allTasks, activeId, event) => {
    const overTaskIndex = taskIdsInColumn.indexOf(overId);
    if (overTaskIndex === -1) { // Se soltar na área da coluna, mas não sobre uma tarefa específica
        // Poderia ser o final da lista ou baseado na posição do mouse
        // Para este exemplo simplificado, se soltar na coluna, adiciona ao final se não for sobre tarefa
        return taskIdsInColumn.length;
    }
    return overTaskIndex; // Lógica básica, pode precisar de ajuste para soltar antes/depois
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {boardData.columnOrder.map(columnId => {
          const column = boardData.columns[columnId];
          const tasksInColumn = column.taskIds.map(taskId => boardData.tasks[taskId]);
          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasksInColumn}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default Board;