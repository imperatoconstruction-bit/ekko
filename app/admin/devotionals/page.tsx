'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminDevotionalsPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [devotionals, setDevotionals] = useState<any[]>([]);

  async function loadDevotionals() {
    const { data } = await supabase
      .from('daily_devotionals')
      .select('*')
      .order('devotional_date', { ascending: false })
      .limit(30);
    setDevotionals(data || []);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      setUserId(data.user.id);
      await loadDevotionals();
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;

    const form = new FormData(event.currentTarget);
    const devotional = {
      devotional_date: String(form.get('devotional_date')),
      verse_reference: String(form.get('verse_reference')),
      verse_text: String(form.get('verse_text')),
      title: String(form.get('title')),
      devotional: String(form.get('devotional')),
      reflection_question: String(form.get('reflection_question') || ''),
      prayer: String(form.get('prayer') || ''),
      action_step: String(form.get('action_step') || '')
    };

    const { error } = await supabase
      .from('daily_devotionals')
      .upsert(devotional, { onConflict: 'devotional_date' });

    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setMessage('Devotional saved.');
    await loadDevotionals();
  }

  async function deleteDevotional(id: any) {
    if (!confirm('Delete this devotional?')) return;
    const { error } = await supabase.from('daily_devotionals').delete().eq('id', id);
    if (error) return setMessage(error.message);
    setMessage('Devotional deleted.');
    await loadDevotionals();
  }

  if (loading) return <main className="container section"><p>Loading devotionals...</p></main>;

  return (
    <main className="container section">
      <p className="eyebrow">Admin</p>
      <h1>Daily Devotionals</h1>
      <p>Create or update the devotional that appears automatically on the member dashboard each day.</p>
      {message && <div className="notice-card">{message}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <input name="devotional_date" type="date" required />
        <input name="title" placeholder="Devotional title" required />
        <input name="verse_reference" placeholder="Verse reference, e.g. Hebrews 10:24-25" required />
        <textarea name="verse_text" placeholder="Full Bible verse text" required />
        <textarea name="devotional" placeholder="Devotional reflection" required />
        <input name="reflection_question" placeholder="Reflection question" />
        <textarea name="prayer" placeholder="Prayer" />
        <input name="action_step" placeholder="Action step" />
        <button className="btn primary" type="submit">Save Devotional</button>
      </form>

      <section className="section">
        <p className="eyebrow">Recent Devotionals</p>
        <div className="feed">
          {devotionals.map((item) => (
            <div className="post" key={item.id}>
              <small>{item.devotional_date}</small>
              <h3>{item.title}</h3>
              <p><strong>{item.verse_reference}</strong></p>
              <p>{item.verse_text}</p>
              <p>{item.devotional}</p>
              <button className="reaction-btn" onClick={() => deleteDevotional(item.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
