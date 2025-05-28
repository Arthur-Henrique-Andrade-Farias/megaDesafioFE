// src/components/TaskDetailModal.jsx
import React, { useState, useEffect, useCallback } from 'react';

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const formatDateForDisplay = (isoDateString) => {
  if (!isoDateString) return 'Não definida';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  } catch (e) {
    return 'Data inválida';
  }
};

const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

const TaskDetailModal = ({
  task,
  allColumns,
  columnOrder,
  isOpen,
  onClose,
  onSaveTitle,
  onSaveDescription,
  onSavePriority,
  onChangeColumn,
  onSaveDueDate,
}) => {
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [editableDueDate, setEditableDueDate] = useState('');
  
  const [currentColumnId, setCurrentColumnId] = useState('');
  const [selectedColumnIdInDropdown, setSelectedColumnIdInDropdown] = useState('');

  const findTaskCurrentColumnId = useCallback(() => {
    if (!task || !allColumns || !columnOrder) return '';
    for (const colId of columnOrder) {
      if (allColumns[colId] && allColumns[colId].taskIds.includes(task.id)) {
        return colId;
      }
    }
    return '';
  }, [task, allColumns, columnOrder]);

  useEffect(() => {
    if (task && isOpen) {
      setEditableTitle(task.title);
      setEditableDescription(task.description || '');
      setSelectedPriority(task.priority || 'medium');
      setEditableDueDate(formatDateForInput(task.dueDate));
      
      const taskColId = findTaskCurrentColumnId();
      setCurrentColumnId(taskColId);
      setSelectedColumnIdInDropdown(taskColId);
    } else if (!isOpen) {
      // Opcional: resetar estados quando o modal é explicitamente fechado e não apenas re-renderizado
      // setEditableTitle(''); 
      // setEditableDescription('');
      // setSelectedPriority('medium');
      // setEditableDueDate('');
      // setCurrentColumnId('');
      // setSelectedColumnIdInDropdown('');
    }
  }, [task, isOpen, findTaskCurrentColumnId]);

  if (!isOpen || !task) {
    return null;
  }

  const handleSaveChanges = () => {
    if (editableTitle.trim() && editableTitle.trim() !== task.title) {
      onSaveTitle(task.id, editableTitle.trim());
    }
    if (editableDescription !== (task.description || '')) {
      onSaveDescription(task.id, editableDescription);
    }
    if (selectedPriority && selectedPriority !== (task.priority || 'medium')) {
      onSavePriority(task.id, selectedPriority);
    }
    
    const dueDateToSave = editableDueDate ? new Date(editableDueDate + 'T00:00:00Z').toISOString() : null;
    if (dueDateToSave !== task.dueDate) {
        onSaveDueDate(task.id, dueDateToSave);
    }

    if (selectedColumnIdInDropdown && selectedColumnIdInDropdown !== currentColumnId) {
      onChangeColumn(task.id, currentColumnId, selectedColumnIdInDropdown);
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h3>Detalhes da Tarefa</h3>

        <label htmlFor="taskTitleEditModal">Título da Tarefa:</label>
        <input
          type="text"
          id="taskTitleEditModal"
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          placeholder="Título da tarefa..."
        />

        <label htmlFor="taskDescriptionEditModal">Descrição:</label>
        <textarea
          id="taskDescriptionEditModal"
          value={editableDescription}
          onChange={(e) => setEditableDescription(e.target.value)}
          rows="4"
          placeholder="Adicione uma descrição mais detalhada..."
        />

        <div className="modal-row">
            <div className="modal-field-group">
                <label htmlFor="taskCreatedAtDisplay">Data de Criação:</label>
                <p id="taskCreatedAtDisplay" className="modal-read-only-field">
                    {formatDateForDisplay(task.createdAt)}
                </p>
            </div>
            <div className="modal-field-group">
                <label htmlFor="taskDueDateModal">Prazo Finalização:</label>
                <input
                  type="date"
                  id="taskDueDateModal"
                  value={editableDueDate}
                  onChange={(e) => setEditableDueDate(e.target.value)}
                />
            </div>
        </div>

        <div className="modal-row">
            <div className="modal-field-group">
                <label htmlFor="taskPrioritySelectModal">Prioridade:</label>
                <select
                  id="taskPrioritySelectModal"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  {priorityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
            </div>
            <div className="modal-field-group">
                <label htmlFor="taskColumnSelectModal">Coluna Atual:</label>
                <select 
                  id="taskColumnSelectModal" 
                  value={selectedColumnIdInDropdown} 
                  onChange={(e) => setSelectedColumnIdInDropdown(e.target.value)}
                >
                  {columnOrder.map(colId => {
                    const column = allColumns[colId];
                    if (!column) return null;
                    return (
                      <option key={colId} value={colId}>
                        {column.title}
                      </option>
                    );
                  })}
                </select>
            </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSaveChanges} className="modal-save">
            Salvar Alterações
          </button>
          <button onClick={onClose} className="modal-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;