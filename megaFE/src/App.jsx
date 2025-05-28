// src/App.jsx
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import Board from './components/Board';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
// Se você criou Auth.css e ele não é importado dentro das páginas, importe aqui:
// import './styles/Auth.css';

function App() {
  // Tenta carregar o estado de login do localStorage ao iniciar
  const getInitialLoginState = () => {
    const storedIsLoggedIn = localStorage.getItem('isTrelloCloneLoggedIn');
    return storedIsLoggedIn === 'true';
  };

  const getInitialCurrentPage = () => {
    return getInitialLoginState() ? 'BOARD' : 'LOGIN';
  };

  const [currentPage, setCurrentPage] = useState(getInitialCurrentPage());
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState());

  // Salva o estado de login no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('isTrelloCloneLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const navigateToLogin = () => {
    setIsLoggedIn(false); // Garante que ao ir para login, o estado é de deslogado
    setCurrentPage('LOGIN');
  };
  const navigateToRegister = () => setCurrentPage('REGISTER');
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('BOARD');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('LOGIN');
    // Opcional: limpar outros dados do usuário do localStorage se houver
    // localStorage.removeItem('userData'); // Exemplo
  };

  let content;
  if (currentPage === 'BOARD') {
    if (isLoggedIn) {
      content = <Board />; // Board só é acessível se isLoggedIn for true
    } else {
      // Se tentar acessar o board sem estar logado, redireciona para login
      content = (
        <LoginPage
          onNavigateToRegister={navigateToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      );
      // Atualiza currentPage para refletir que estamos mostrando login
      // Isso pode ser feito dentro de um useEffect se preferir, para evitar set state durante render
      // Mas para este exemplo simples, vamos corrigir no próximo ciclo de renderização se necessário
      if (currentPage !== 'LOGIN') setCurrentPage('LOGIN'); 
    }
  } else if (currentPage === 'LOGIN') {
    content = (
      <LoginPage
        onNavigateToRegister={navigateToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  } else if (currentPage === 'REGISTER') {
    content = (
      <RegisterPage
        onNavigateToLogin={navigateToLogin}
        onRegisterSuccess={navigateToLogin} // Após registro, vai para login
      />
    );
  }

  return (
    <div className="app">
      {currentPage === 'BOARD' && isLoggedIn && (
        <header className="app-header">
          <h1>MegaTasks</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
      )}
      <main className={currentPage === 'BOARD' && isLoggedIn ? "app-main" : "auth-main-full"}>
        {content}
      </main>
    </div>
  );
}

export default App;