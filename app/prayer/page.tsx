'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PrayerPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);

  async function loadPrayers() {
    const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(20);
    setPrayers(data || []);
    const ids = (data || []).map((item) => item.id);
    if (ids.length > 0) {
      const { data: reactions } = await supabase.from('prayer_reactions').select('*').in('prayer_id', ids);
      const counts: Record<string, Record<string, number>> = {};
      (reactions || []).forEach((reaction) => {
        const prayerId = String(reaction.prayer_id);
        if (!counts[prayerId]) counts[prayerId] = {};
        counts[prayerId][reaction.reaction_type] = (counts[prayerId][reaction.reaction_type] || 0) + 1;
      });
      setReactionCounts(counts);
      const { data: commentData } = await supabase.from('comments').select('*').eq('content_type', 'prayer').in('content_id', ids).order('created_at', { ascending: true });
      const grouped: Record<string, any[]> = {};
      (commentData || []).forEach((comment) => {
        const key = String(comment.content_id);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(comment);
      });
      setComments(grouped);
    } else {
      setReactionCounts({});
      setComments({});
    }
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setLoading(false); return; }
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
    event.currentTarget.reset();
    setShowForm(false);
    setMessage('Prayer request submitted.');
    await loadPrayers();
  }

  async function addReaction(prayerId: any, reactionType: string) {
    if (!userId) return (window.location.href = '/login');
    const { error } = await supabase.from('prayer_reactions').insert({ prayer_id: prayerId, user_id: userId, reaction_type: reactionType });
    if (error) return setMessage(error.message);
    setMessage('Reaction added.');
    await loadPrayers();
  }

  async function addComment(event: React.FormEvent<HTMLFormElement>, prayerId: any) {
    event.preventDefault();
    if (!userId) return (window.location.href = '/login');
    const form = new FormData(event.currentTarget);
    const body = String(form.get('comment'));
    if (!body.trim()) return;
    const { error } = await supabase.from('comments').insert({ user_id: userId, content_type: 'prayer', content_id: prayerId, body });
    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setMessage('Comment posted.');
    await loadPrayers();
  }

  async function deletePrayer(prayerId: any) {
    if (!confirm('Delete this prayer request?')) return;
    await supabase.from('comments').delete().eq('content_type', 'prayer').eq('content_id', prayerId);
    await supabase.from('prayer_reactions').delete().eq('prayer_id', prayerId);
    const { error } = await supabase.from('prayer_requests').delete().eq('id', prayerId).eq('user_id', userId);
    if (error) return setMessage(error.message);
    setMessage('Prayer request deleted.');
    await loadPrayers();
  }

  if (loading) return <main className="container section"><p>Loading...</p></main>;
  if (!userId) return <main className="container section"><p className="eyebrow">Members Only</p><h1>Join EKKO to view the Prayer Wall.</h1><p>Prayer requests are part of the private EKKO community.</p><a className="btn primary" href="/signup">Create Account</a><a className="btn" href="/login">Login</a></main>;

  return (
    <main className="container section">
      <div className="hero-actions"><p className="eyebrow">Prayer Wall</p><button className="btn primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Share Prayer'}</button></div>
      <h1>Carry burdens together.</h1>
      <p>Share a prayer request, pray for others, and encourage the EKKO community.</p>
      {message && <div className="notice-card">{message}</div>}
      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Prayer title" required />
          <textarea name="body" placeholder="How can we pray?" required />
          <button className="btn primary" type="submit">Submit Prayer</button>
        </form>
      )}
      <div className="feed">
        {prayers.map((prayer) => {
          const counts = reactionCounts[String(prayer.id)] || {};
          const prayerComments = comments[String(prayer.id)] || [];
          const isOwner = prayer.user_id === userId;
          return (
            <div className="post" key={prayer.id}>
              <small>Prayer Request</small><h3>{prayer.title}</h3><p>{prayer.body}</p>
              <div className="reaction-row">
                <button className="reaction-btn" onClick={() => addReaction(prayer.id, 'praying')}>🙏 I&apos;m Praying ({counts.praying || 0})</button>
                <button className="reaction-btn" onClick={() => addReaction(prayer.id, 'encouraged')}>❤️ Encouraged ({counts.encouraged || 0})</button>
                <button className="reaction-btn" onClick={() => addReaction(prayer.id, 'follow')}>📌 Follow ({counts.follow || 0})</button>
                <span className="reaction-btn">💬 {prayerComments.length} Comments</span>
                {isOwner && <button className="reaction-btn" onClick={() => deletePrayer(prayer.id)}>Delete</button>}
              </div>
              <div className="comment-list">{prayerComments.map((comment) => <p key={comment.id}>💬 {comment.body}</p>)}</div>
              <form className="comment-form" onSubmit={(event) => addComment(event, prayer.id)}><input name="comment" placeholder="Write a prayer or encouragement..." /><button className="btn" type="submit">Comment</button></form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
