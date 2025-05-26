// src/App.jsx
import React from 'react';
import Board from './components/Board';
import './App.css'; // Importaremos nossos estilos aqui

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Trello Clone</h1>
      </header>
      <main className="app-main">
        <Board />
      </main>
    </div>
  );
}

export default App;