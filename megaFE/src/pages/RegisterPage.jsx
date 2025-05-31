// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../styles/Auth.css';

// PASSO 1: Configure as credenciais do Supabase
// Substitua com a URL e a chave anônima (anon key) do seu projeto Supabase
const supabaseUrl = 'https://zxrtjasxungnpcgxaoip.supabase.co'; // SEU VALOR AQUI
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnRqYXN4dW5nbnBjZ3hhb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY0MDIsImV4cCI6MjA2Mjc2MjQwMn0.wR8ExVL3FY_TrQCPY274HHnZCXo40_v31X_uSK-xsXU'; // SEU VALOR AQUI

// Verifique se as variáveis foram preenchidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL ou Anon Key não foram configuradas. O registro não funcionará.'
  );
  // Você pode querer lançar um erro ou exibir uma mensagem mais proeminente para o usuário aqui
  // em um ambiente de desenvolvimento para garantir que isso seja corrigido.
}

// Crie o cliente Supabase
// Certifique-se de que a inicialização só ocorra se as chaves estiverem presentes
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const RegisterPage = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

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

    // Verificar se o Supabase client foi inicializado corretamente
    if (!supabase) { // Verificação atualizada para o cliente supabase
        setError('Configuração do Supabase incompleta. Verifique o console ou as credenciais fornecidas.');
        console.error('Cliente Supabase não inicializado. Verifique supabaseUrl e supabaseAnonKey.');
        return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        setError(signUpError.message);
        console.error('Erro no registro Supabase:', signUpError);
        setLoading(false);
        return;
      }

      if (data.user) {
        const message = data.session
          ? 'Registro bem-sucedido! Redirecionando...'
          : 'Registro quase completo! Por favor, verifique seu e-mail para confirmação.';
        
        alert(message);

        if (onRegisterSuccess) {
          onRegisterSuccess(data.user, data.session);
        }
      } else if (!signUpError) { // Adicionado para cobrir casos onde não há erro, mas não há usuário (raro com signUp)
        setError('Ocorreu um problema no registro. Tente novamente.');
        console.warn('Supabase signUp retornou sem erro, mas sem usuário:', data);
      }

    } catch (catchError) {
      console.error('Erro inesperado no handleRegister:', catchError);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ... (o restante do componente JSX permanece o mesmo)
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          {error && <p className="auth-error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading || !supabase}>
            {loading ? 'Registrando...' : 'Registrar'}
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