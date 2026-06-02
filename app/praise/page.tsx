'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PraisePage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    const category = String(form.get('category') || 'Praise');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      window.location.href = '/login';
      return;
    }
    const { error } = await supabase.from('praise_reports').insert({
      user_id: userData.user.id,
      title,
      body,
      category
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Praise report shared.');
    event.currentTarget.reset();
  }

  return (
    <main className="container section">
      <p className="eyebrow">Praise Reports</p>
      <h1>Share What God Is Doing.</h1>
      <p>Praise reports help the community remember that God is still moving.</p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Praise report title" required />
        <select name="category">
          <option>Answered Prayer</option>
          <option>Provision</option>
          <option>Healing</option>
          <option>Family</option>
          <option>Faith</option>
          <option>Breakthrough</option>
        </select>
        <textarea name="body" placeholder="What did God do?" required />
        <button className="btn primary" type="submit">Share Praise</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
