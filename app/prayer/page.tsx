'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PrayerPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<any[]>([]);

  async function loadPrayers() {
    const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(20);
    setPrayers(data || []);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUserId(data.user.id);
      await loadPrayers();
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    if (!userId) return (window.location.href = '/login');

    const { error } = await supabase.from('prayer_requests').insert({ user_id: userId, title, body });
    if (error) return setMessage(error.message);

    setMessage('Prayer request submitted.');
    event.currentTarget.reset();
    loadPrayers();
  }

  if (loading) return <main className="container section"><p>Loading...</p></main>;

  if (!userId) {
    return (
      <main className="container section">
        <p className="eyebrow">Members Only</p>
        <h1>Join EKKO to view the Prayer Wall.</h1>
        <p>Prayer requests are part of the private EKKO community. Create an account or login to pray with others.</p>
        <a className="btn primary" href="/signup">Create Account</a>
        <a className="btn" href="/login">Login</a>
      </main>
    );
  }

  return (
    <main className="container section">
      <p className="eyebrow">Prayer Wall</p>
      <h1>Carry burdens together.</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Prayer title" required />
        <textarea name="body" placeholder="How can we pray?" required />
        <button className="btn primary" type="submit">Submit Prayer</button>
        <p>{message}</p>
      </form>
      <div className="feed">
        {prayers.map((prayer) => (
          <div className="post" key={prayer.id}>
            <small>Prayer Request</small>
            <h3>{prayer.title}</h3>
            <p>{prayer.body}</p>
            <p>🙏 {prayer.prayer_count || 0} praying</p>
          </div>
        ))}
      </div>
    </main>
  );
}
