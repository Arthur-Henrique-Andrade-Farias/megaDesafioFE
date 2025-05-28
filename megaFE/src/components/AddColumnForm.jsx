// src/components/AddColumnForm.jsx
import React, { useState } from 'react';

const AddColumnForm = ({ onAddColumn }) => {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddColumn(title.trim());
    setTitle('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button className="add-column-button open-form" onClick={() => setIsEditing(true)}>
        + Adicionar outra lista
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="add-column-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Insira o título da lista..."
        autoFocus
        className="add-column-input"
      />
      <div className="add-column-controls">
        <button type="submit" className="add-column-submit">
          Adicionar Lista
        </button>
        <button type="button" className="add-column-cancel" onClick={() => setIsEditing(false)}>
          ✕
        </button>
      </div>
    </form>
  );
};

export default AddColumnForm;