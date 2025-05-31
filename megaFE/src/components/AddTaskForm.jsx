import React, { useState } from 'react';

const AddTaskForm = ({ columnId, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsEditing(false);
      return;
    }
    onAddTask(title.trim(), columnId);
    setTitle('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button 
        className="btn btn-subtle" 
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
        onBlur={() => { if(!title.trim()) setIsEditing(false);}}
        className="add-task-textarea"
        rows="3"
      />
      <div className="add-task-controls">
        <button type="submit" className="btn btn-success">
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