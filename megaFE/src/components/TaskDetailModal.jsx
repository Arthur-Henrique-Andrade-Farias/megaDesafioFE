import React, { useState, useEffect } from 'react';

const priorityUIOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const priorityUIStringToNumber = (priorityStr) => {
  if (priorityStr === 'high') return 1;
  if (priorityStr === 'medium') return 2;
  if (priorityStr === 'low') return 3;
  return 2;
};

const formatDateForDateTimeInput = (isoOrApiDateString) => {
    if (!isoOrApiDateString) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0,16);
    }
    if (typeof isoOrApiDateString === 'string' && isoOrApiDateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        return isoOrApiDateString;
    }
    try {
        const date = new Date(isoOrApiDateString);
        if (isNaN(date.getTime())) return formatDateForDateTimeInput('');
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date.valueOf() - offset)).toISOString().slice(0,16);
    } catch (e) {
        return formatDateForDateTimeInput('');
    }
};

const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
  onSaveTask,
  initialTitle = '',
  initialState = 'To Do',
  fixedColumnStates,
}) => {
  const [currentId, setCurrentId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriorityUI, setFormPriorityUI] = useState('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formState, setFormState] = useState('To Do');
  const [formCheck, setFormCheck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultState = fixedColumnStates && fixedColumnStates.length > 0 ? fixedColumnStates[1] : 'To Do';
      if (task && task.id != null) {
        setCurrentId(task.id);
        setFormTitle(task.title || '');
        setFormDescription(task.description || '');
        setFormPriorityUI(task.priority || 'medium');
        setFormDueDate(formatDateForDateTimeInput(task.dueDate));
        setFormState(fixedColumnStates && fixedColumnStates.includes(task.state) ? task.state : defaultState);
        setFormCheck(task.check || false);
      } else {
        setCurrentId(null);
        setFormTitle(initialTitle || '');
        setFormDescription('');
        setFormPriorityUI('medium');
        setFormDueDate(formatDateForDateTimeInput(''));
        setFormState(fixedColumnStates && fixedColumnStates.includes(initialState) ? initialState : defaultState);
        setFormCheck(false);
      }
    }
  }, [task, isOpen, initialTitle, initialState, fixedColumnStates]);

  if (!isOpen) return null;

  const handleInternalSave = () => {
    if (!formTitle.trim()) {
        alert("O título é obrigatório.");
        return;
    }
    const taskDataForHook = {
      id: currentId,
      titulo: formTitle.trim(),
      descricao: formDescription.trim(),
      prioridade: priorityUIStringToNumber(formPriorityUI),
      date: formDueDate,
      state: formState,
      check: formCheck,
    };
    onSaveTask(taskDataForHook);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  const availableStatesToSelect = fixedColumnStates || ['Backlog', 'To Do', 'Doing', 'Done', 'Stopped'];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h3>{currentId ? 'Detalhes da Tarefa' : 'Nova Tarefa'}</h3>

        <label htmlFor="taskTitleModal">Título da Tarefa:</label>
        <input type="text" id="taskTitleModal" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Título da tarefa..." />

        <label htmlFor="taskDescriptionModal">Descrição:</label>
        <textarea id="taskDescriptionModal" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows="4" placeholder="Adicione uma descrição mais detalhada..." />
        
        <div className="modal-field-group">
          <label htmlFor="taskDueDateModal">Data de Conclusão (Prazo):</label>
          <input type="datetime-local" id="taskDueDateModal" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} />
        </div>

        <div className="modal-row">
            <div className="modal-field-group">
                <label htmlFor="taskPriorityModal">Prioridade:</label>
                <select id="taskPriorityModal" value={formPriorityUI} onChange={(e) => setFormPriorityUI(e.target.value)}>
                  {priorityUIOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
            </div>
            <div className="modal-field-group">
                <label htmlFor="taskStateModal">Coluna Atual:</label>
                <select id="taskStateModal" value={formState} onChange={(e) => setFormState(e.target.value)}>
                  {availableStatesToSelect.map(stateVal => ( <option key={stateVal} value={stateVal}>{stateVal}</option> ))}
                </select>
            </div>
        </div>
        <div className="modal-actions">
          <button onClick={handleInternalSave} className="btn btn-success">
            Salvar Alterações
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;