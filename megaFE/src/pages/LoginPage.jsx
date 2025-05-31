// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // Importe o createClient
import '../styles/Auth.css'; // Reutilizaremos o mesmo CSS

// PASSO 1: Configure as credenciais do Supabase (mesmas do RegisterPage)
// É RECOMENDADO usar variáveis de ambiente para isso em um projeto real.
const supabaseUrl = 'https://zxrtjasxungnpcgxaoip.supabase.co'; // Sua URL Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnRqYXN4dW5nbnBjZ3hhb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY0MDIsImV4cCI6MjA2Mjc2MjQwMn0.wR8ExVL3FY_TrQCPY274HHnZCXo40_v31X_uSK-xsXU'; // Sua Chave Anônima Supabase

// Verifique se as variáveis foram preenchidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL ou Anon Key não foram configuradas. O login não funcionará.'
  );
}

// Crie o cliente Supabase
// Certifique-se de que a inicialização só ocorra se as chaves estiverem presentes
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const LoginPage = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Para feedback de carregamento

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Verificar se o Supabase client foi inicializado corretamente
    if (!supabase) {
        setError('Configuração do Supabase incompleta. Verifique o console ou as credenciais fornecidas.');
        console.error('Cliente Supabase não inicializado. Verifique supabaseUrl e supabaseAnonKey.');
        return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      // PASSO 2: Use o método signInWithPassword do Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        // Trata erros específicos do Supabase
        setError(signInError.message);
        console.error('Erro no login Supabase:', signInError);
        setLoading(false);
        return;
      }

      // Se o login for bem-sucedido, data.user e data.session existirão
      if (data.user && data.session) {
        alert('Login bem-sucedido! Redirecionando...');
        if (onLoginSuccess) {
          onLoginSuccess(data.user, data.session); // Passe os dados do usuário e sessão
        }
      } else if (!signInError) {
        // Caso onde não há erro, mas não há usuário/sessão (pode indicar e-mail não confirmado se essa for a política)
        // O Supabase geralmente retorna um erro específico para e-mail não confirmado.
        setError('Não foi possível fazer login. Verifique suas credenciais ou confirme seu e-mail.');
        console.warn('Supabase signIn retornou sem erro, mas sem usuário/sessão:', data);
      }

    } catch (catchError) {
      // Trata outros erros que podem ocorrer
      console.error('Erro inesperado no handleLogin:', catchError);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          {error && <p className="auth-error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading || !supabase}>
            {loading ? 'Entrando...' : 'Entrar'}
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