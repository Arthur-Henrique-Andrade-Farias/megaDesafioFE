// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import '../styles/Auth.css'; // Criaremos este arquivo CSS

// Para simular navegação sem React Router por enquanto
// Em um app real, você usaria <Link to="/register"> do React Router
const LoginPage = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    console.log('Tentando login com:', { email, password });
    // Aqui viria a lógica de API para login
    // Se o login for bem-sucedido:
    // onLoginSuccess(); // Função para, por exemplo, redirecionar para o board
    alert('Login simulado com sucesso! (Redirecionando para o board...)');
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h2>Login na Plataforma</h2>
        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label htmlFor="login-email">Email</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="login-password">Senha</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="auth-input"
            />
          </div>
          {error && <p className="auth-error-message">{error}</p>}
          <button type="submit" className="auth-button">
            Entrar
          </button>
        </form>
        <div className="auth-extra-links">
          {/* <a href="#" className="auth-link">Esqueceu sua senha?</a> */}
          <p className="auth-switch-link">
            Não tem uma conta?{' '}
            <span onClick={onNavigateToRegister} className="auth-link clickable">
              Registre-se aqui
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;