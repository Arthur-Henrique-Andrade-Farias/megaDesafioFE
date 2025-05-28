// src/components/AddTaskForm.jsx
import React, { useState } from 'react';

const AddTaskForm = ({ columnId, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsEditing(false); // Esconde se estiver vazio e submeter
      return;
    }
    onAddTask(title.trim(), columnId); // Chama a função passada por Column.jsx
    setTitle('');
    // Mantém o formulário aberto para adicionar mais tarefas rapidamente, se desejar
    // Para fechar após adicionar, descomente a linha abaixo:
    // setIsEditing(false); 
  };

  if (!isEditing) {
    return (
      <button 
        className="add-task-button open-form" 
        onClick={() => setIsEditing(true)}
      >
        + Adicionar um cartão
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Insira um título para este cartão..."
        autoFocus
        onBlur={() => { if(!title.trim()) setIsEditing(false);}} // Fecha se clicar fora e estiver vazio
        className="add-task-textarea"
        rows="3" // Ajuste conforme necessário
      />
      <div className="add-task-controls">
        <button type="submit" className="add-task-submit">
          Adicionar Cartão
        </button>
        <button 
          type="button" 
          className="add-task-cancel" 
          onClick={() => { setIsEditing(false); setTitle('');}}
        >
          ✕
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;