---
layout: default
title: "Acesso Restrito"
description: "Página de login"
---

<div class="login-container">
  <div class="login-card">
    <div class="login-icon">🔒</div>
    <h1 class="login-title">Acesso Restrito</h1>
    <p class="login-sub">Esta página requer autenticação.</p>

    <form id="loginForm" class="login-form" novalidate>
      <div class="field-group">
        <label for="username">Usuário</label>
        <input type="text" id="username" name="username" autocomplete="username"
               placeholder="Digite seu usuário" required />
      </div>
      <div class="field-group">
        <label for="password">Senha</label>
        <input type="password" id="password" name="password" autocomplete="current-password"
               placeholder="Digite sua senha" required />
      </div>
      <p class="login-error" id="loginError" hidden>Usuário ou senha incorretos.</p>
      <button type="submit" class="login-btn" id="loginBtn">Entrar</button>
    </form>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    text-align: center;
  }

  .login-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .login-title {
    font-size: 1.6rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .login-sub {
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    text-align: left;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field-group label {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
  }

  .field-group input {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.25s;
  }

  .field-group input:focus {
    border-color: rgba(232, 160, 32, 0.6);
  }

  .field-group input::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  .login-error {
    color: #f87171;
    font-size: 0.85rem;
    text-align: center;
    margin: 0;
  }

  .login-btn {
    background: #e8a020;
    color: #0d0f14;
    border: none;
    border-radius: 8px;
    padding: 0.875rem;
    font-size: 1rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    margin-top: 0.25rem;
  }

  .login-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
</style>

<script>
(function () {
  const STORED_USER = 'Cloker98';
  const STORED_HASH = '21c9d72e98713999535e7fc12fb14f26af69023f8c7454eeb73eec310bd0c6e5';
  const AUTH_KEY    = 'vshape_auth';

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function nextPage() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    return next && next.startsWith('/') ? next : '/vshape';
  }

  // Already authenticated → go straight to destination
  if (localStorage.getItem(AUTH_KEY) === 'ok') {
    window.location.replace(nextPage());
  }

  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const err = document.getElementById('loginError');
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    btn.disabled = true;
    btn.textContent = 'Verificando...';
    err.hidden = true;

    const hash = await sha256(pass);

    if (user === STORED_USER && hash === STORED_HASH) {
      localStorage.setItem(AUTH_KEY, 'ok');
      window.location.replace(nextPage());
    } else {
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
})();
</script>
