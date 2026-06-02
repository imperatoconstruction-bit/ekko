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
    const { data } = await supabase.auth.getUser();
    if (!data.user) return (window.location.href = '/login');

    const { error } = await supabase.from('praise_reports').insert({
      user_id: data.user.id,
      title,
      body,
      category
    });

    if (error) return setMessage(error.message);

    setMessage('Praise report shared.');
    event.currentTarget.reset();
  }

  return (
    <main className="container section">
      <p className="eyebrow">Praise Reports</p>
      <h1>Share What God Is Doing.</h1>
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
