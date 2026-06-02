'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);

    window.location.href = '/dashboard';
  }

  return (
    <main className="container section">
      <p className="eyebrow">Member Login</p>
      <h1>Welcome Back.</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button className="btn primary" type="submit">Login</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
