'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PrayerPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    const { data } = await supabase.auth.getUser();
    if (!data.user) return (window.location.href = '/login');

    const { error } = await supabase.from('prayer_requests').insert({
      user_id: data.user.id,
      title,
      body
    });

    if (error) return setMessage(error.message);

    setMessage('Prayer request submitted.');
    event.currentTarget.reset();
  }

  return (
    <main className="container section">
      <p className="eyebrow">Prayer Wall</p>
      <h1>Share A Prayer Request</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Prayer title" required />
        <textarea name="body" placeholder="How can we pray?" required />
        <button className="btn primary" type="submit">Submit Prayer</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
