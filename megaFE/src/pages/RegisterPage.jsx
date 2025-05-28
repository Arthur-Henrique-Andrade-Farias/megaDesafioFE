// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import '../styles/Auth.css'; // Reutilizaremos o mesmo CSS

// Para simular navegação sem React Router
const RegisterPage = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    console.log('Tentando registrar com:', { email, password });
    // Aqui viria a lógica de API para registro
    // Se o registro for bem-sucedido:
    // onRegisterSuccess();
    alert('Registro simulado com sucesso! (Redirecionando para o login ou board...)');
    if (onRegisterSuccess) onRegisterSuccess(); // Poderia ser onNavigateToLogin também
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h2>Crie sua Conta</h2>
        <form onSubmit={handleRegister}>
          <div className="auth-input-group">
            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="register-password">Senha</label>
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha (mín. 6 caracteres)"
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="register-confirm-password">Confirmar Senha</label>
            <input
              type="password"
              id="register-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className="auth-input"
            />
          </div>
          {error && <p className="auth-error-message">{error}</p>}
          <button type="submit" className="auth-button">
            Registrar
          </button>
        </form>
        <div className="auth-extra-links">
          <p className="auth-switch-link">
            Já tem uma conta?{' '}
            <span onClick={onNavigateToLogin} className="auth-link clickable">
              Faça login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;