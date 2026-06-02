'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PraisePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [praises, setPraises] = useState<any[]>([]);

  async function loadPraises() {
    const { data } = await supabase.from('praise_reports').select('*').order('created_at', { ascending: false }).limit(20);
    setPraises(data || []);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUserId(data.user.id);
      await loadPraises();
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    const category = String(form.get('category') || 'Praise');
    if (!userId) return (window.location.href = '/login');

    const { error } = await supabase.from('praise_reports').insert({ user_id: userId, title, body, category });
    if (error) return setMessage(error.message);

    setMessage('Praise report shared.');
    event.currentTarget.reset();
    loadPraises();
  }

  if (loading) return <main className="container section"><p>Loading...</p></main>;

  if (!userId) {
    return (
      <main className="container section">
        <p className="eyebrow">Members Only</p>
        <h1>Join EKKO to view Praise Reports.</h1>
        <p>Praise reports are part of the private EKKO community. Create an account or login to celebrate what God is doing.</p>
        <a className="btn primary" href="/signup">Create Account</a>
        <a className="btn" href="/login">Login</a>
      </main>
    );
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
      <div className="feed">
        {praises.map((praise) => (
          <div className="post" key={praise.id}>
            <small>{praise.category || 'Praise Report'}</small>
            <h3>{praise.title}</h3>
            <p>{praise.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
