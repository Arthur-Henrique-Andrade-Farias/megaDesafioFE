import React, { useState, useMemo, useEffect } from 'react';
import Column from './Column';
import TaskDetailModal from './TaskDetailModal';
import BoardFilters from './BoardFilters';
import { useTarefas } from '../../../../Mega-Grupo-5-Web/src/hooks/useTarefa';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Task from './Task';

const priorityStringToNumber = (priorityStr) => {
  if (priorityStr === 'high') return 1;
  if (priorityStr === 'medium') return 2;
  if (priorityStr === 'low') return 3;
  return 2;
};

const priorityNumberToString = (priorityNum) => {
  if (priorityNum === 1) return 'high';
  if (priorityNum === 2) return 'medium';
  if (priorityNum === 3) return 'low';
  return 'medium';
};

const Board = () => {
  const {
    tarefas,
    error: hookError,
    handleSubmit,
    handleDelete,
    MudaCheckTarefa,
    modoEdit,
    aplicarFiltros,
    limparFiltros,
    agruparState,
  } = useTarefas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskForModal, setCurrentTaskForModal] = useState(null);
  const [formStateForHook, setFormStateForHook] = useState({
    titulo: '',
    descricao: '',
    prioridade: 2,
    date: '',
    state: 'To Do',
    check: false,
  });

  const [uiFilters, setUiFilters] = useState({
    titulo: '',
    prioridade: 'all',
    data: '',
    ordenar: 'padrao',
  });
  const [showFiltersUI, setShowFiltersUI] = useState(false);
  const [activeDraggedTask, setActiveDraggedTask] = useState(null);

  const processedBoardData = useMemo(() => {
    if (!tarefas) return { columns: {}, columnOrder: [] };
    const groupedTasks = agruparState(tarefas);
    const columnOrder = Object.keys(groupedTasks);
    return { columns: groupedTasks, columnOrder };
  }, [tarefas, agruparState]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleOpenModalForNew = (initialTitle = '', columnState = 'To Do') => {
    setCurrentTaskForModal(null);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const newFormData = {
      id: undefined,
      titulo: initialTitle,
      descricao: '',
      prioridade: 2,
      date: now.toISOString().slice(0, 16),
      state: columnState,
      check: false,
    };
    setFormStateForHook(newFormData);
    modoEdit(newFormData, setFormStateForHook);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (taskFromApi) => {
    setCurrentTaskForModal(taskFromApi);
    modoEdit(taskFromApi, setFormStateForHook);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTaskForModal(null);
  };

  const handleSaveTaskFromModal = async (formDataFromModal) => {
    await handleSubmit(formDataFromModal, setFormStateForHook);
    handleCloseModal();
  };

  const handleToggleTaskCheck = async (taskFromApi) => {
    await MudaCheckTarefa(taskFromApi);
  };

  const handleDeleteTaskWithConfirmation = async (taskId) => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      await handleDelete(taskId);
    }
  };
  
  const onDragStart = (event) => {
    const task = tarefas.find(t => String(t.id) === String(event.active.id));
    setActiveDraggedTask(task);
  };

  const onDragEnd = async (event) => {
    setActiveDraggedTask(null);
    const { active, over } = event;
    if (!over || !active) return;

    const activeTaskId = Number(active.id);
    const taskToMove = tarefas.find(t => t.id === activeTaskId);
    if (!taskToMove) return;

    let newContainerState = String(over.id);
    if (!processedBoardData.columns[newContainerState]) {
        const overTask = tarefas.find(t => String(t.id) === String(over.id));
        if (overTask && processedBoardData.columns[overTask.state]) {
            newContainerState = overTask.state;
        } else {
            return;
        }
    }
    
    if (taskToMove.state !== newContainerState) {
      const updatedTaskDataForHook = {
        ...taskToMove,
        state: newContainerState,
      };
      modoEdit(taskToMove, setFormStateForHook);
      const finalFormState = { ...formStateForHook, ...updatedTaskDataForHook };
      setFormStateForHook(finalFormState);
      await handleSubmit(finalFormState, setFormStateForHook);
    }
  };
  
  const handleApplyUiFilters = () => {
    const apiFilters = {
        titulo: uiFilters.titulo || undefined,
        prioridade: uiFilters.prioridade === 'all' ? undefined : priorityStringToNumber(uiFilters.prioridade),
        data: uiFilters.data || undefined,
        ordenar: uiFilters.ordenar === 'padrao' ? undefined : uiFilters.ordenar,
    };
    aplicarFiltros(apiFilters);
  };

  const handleClearUiFilters = () => {
    limparFiltros(setUiFilters);
  };
  
  if (hookError && !tarefas.length) {
      return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Erro ao carregar tarefas: {hookError}. Verifique se a API está funcionando.</div>;
  }

  return (
    <>
      {hookError && <div style={{position: 'fixed', bottom: '20px', left: '20px', background: 'orange', color: 'black', padding: '10px', borderRadius: '5px', zIndex: 1000}}>Aviso: {hookError}</div>}
      
      <div className="board-controls">
        <button 
            onClick={() => handleOpenModalForNew('', processedBoardData.columnOrder.length > 1 ? processedBoardData.columnOrder[1] : 'To Do')} 
            className="btn btn-primary">
            Adicionar Cartão
        </button>
        <button
          onClick={() => setShowFiltersUI(prev => !prev)}
          className="btn btn-primary"
        >
          {showFiltersUI ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {showFiltersUI && (
        <BoardFilters
          priorityFilter={uiFilters.prioridade}
          onPriorityFilterChange={(value) => setUiFilters(prev => ({ ...prev, prioridade: value }))}
          sortCriteria={uiFilters.ordenar}
          onSortChange={(value) => setUiFilters(prev => ({ ...prev, ordenar: value }))}
          searchTerm={uiFilters.titulo}
          onSearchTermChange={(value) => setUiFilters(prev => ({ ...prev, titulo: value }))}
          onClearFilters={handleClearUiFilters}
          onApplyFilters={handleApplyUiFilters}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="board">
          {(processedBoardData.columnOrder || []).map(columnStateKey => {
            const tasksInColumn = processedBoardData.columns[columnStateKey];
            
            return (
              <Column
                key={columnStateKey}
                column={{ id: columnStateKey, title: columnStateKey }}
                tasks={tasksInColumn || []}
                onOpenTaskModal={handleOpenModalForEdit}
                onToggleTaskDone={handleToggleTaskCheck}
                onAddNewTask={handleOpenModalForNew}
              />
            );
          })}
        </div>
        <DragOverlay>{activeDraggedTask ? <Task task={activeDraggedTask} /> : null}</DragOverlay>
      </DndContext>

      {isModalOpen && (
        <TaskDetailModal
          task={currentTaskForModal ? {
                id: currentTaskForModal.id,
                title: formStateForHook.titulo,
                description: formStateForHook.descricao,
                priority: priorityNumberToString(formStateForHook.prioridade),
                dueDate: formStateForHook.date,
                state: formStateForHook.state,
                check: formStateForHook.check ?? currentTaskForModal.check,
            } : null}
          
          initialTitle={!currentTaskForModal ? formStateForHook.titulo : undefined}
          initialState={!currentTaskForModal ? formStateForHook.state : undefined}
          
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveTask={handleSaveTaskFromModal}
          fixedColumnStates={processedBoardData.columnOrder && processedBoardData.columnOrder.length > 0 ? processedBoardData.columnOrder : ['Backlog', 'To Do', 'Doing', 'Done', 'Stopped']}
        />
      )}
    </>
  );
};

export default Board;