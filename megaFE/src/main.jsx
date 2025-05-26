// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Se você limpou o index.css padrão do Vite, remova a importação dele.
// Se você criou um index.css para estilos globais, importe-o aqui.
// import './index.css' // ou o App.css se preferir os estilos globais lá

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)