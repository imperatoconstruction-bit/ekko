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
    const first_name = String(form.get('first_name'));
    const last_name = String(form.get('last_name'));
    const display_name = String(form.get('display_name'));
    const location = String(form.get('location'));

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setMessage(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({ id: data.user.id, first_name, last_name, display_name, location });
      if (profileError) return setMessage(`Account created, but profile did not save: ${profileError.message}. Login and complete your profile.`);
    }

    setMessage('Account created. Check your email if confirmation is required, then login.');
  }

  return (
    <main className="container section">
      <div className="hero-actions">
        <a className="btn" href="/">Home</a>
        <a className="btn" href="/login">Login</a>
      </div>
      <p className="eyebrow">Create account</p>
      <h1>Join EKKO.</h1>
      <p>Create your member profile to access the Prayer Wall, Praise Reports, Community Feed, and Dashboard.</p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First name" required />
        <input name="last_name" placeholder="Last name" required />
        <input name="display_name" placeholder="Display name" required />
        <input name="location" placeholder="City / State" />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required minLength={6} />
        <button className="btn primary" type="submit">Create Account</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
