'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SignupPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const name = String(form.get('name'));

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, display_name: name });
    }

    setMessage('Account created. Check your email if confirmation is required, then login.');
  }

  return (
    <main className="container section">
      <p className="eyebrow">Create account</p>
      <h1>Join EKKO.</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Display name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required minLength={6} />
        <button className="btn primary" type="submit">Create Account</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
