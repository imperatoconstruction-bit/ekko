'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PraisePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [praises, setPraises] = useState<any[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);

  async function loadPraises() {
    const { data } = await supabase.from('praise_reports').select('*').order('created_at', { ascending: false }).limit(20);
    setPraises(data || []);
    const ids = (data || []).map((item) => item.id);
    if (ids.length > 0) {
      const { data: reactions } = await supabase.from('praise_reactions').select('*').in('praise_id', ids);
      const counts: Record<string, Record<string, number>> = {};
      (reactions || []).forEach((reaction) => {
        const praiseId = String(reaction.praise_id);
        if (!counts[praiseId]) counts[praiseId] = {};
        counts[praiseId][reaction.reaction_type] = (counts[praiseId][reaction.reaction_type] || 0) + 1;
      });
      setReactionCounts(counts);
      const { data: commentData } = await supabase.from('comments').select('*').eq('content_type', 'praise').in('content_id', ids).order('created_at', { ascending: true });
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
    event.currentTarget.reset();
    setShowForm(false);
    setMessage('Praise report shared.');
    await loadPraises();
  }

  async function addReaction(praiseId: any, reactionType: string) {
    if (!userId) return (window.location.href = '/login');
    const { error } = await supabase.from('praise_reactions').insert({ praise_id: praiseId, user_id: userId, reaction_type: reactionType });
    if (error) return setMessage(error.message);
    setMessage('Reaction added.');
    await loadPraises();
  }

  async function addComment(event: React.FormEvent<HTMLFormElement>, praiseId: any) {
    event.preventDefault();
    if (!userId) return (window.location.href = '/login');
    const form = new FormData(event.currentTarget);
    const body = String(form.get('comment'));
    if (!body.trim()) return;
    const { error } = await supabase.from('comments').insert({ user_id: userId, content_type: 'praise', content_id: praiseId, body });
    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setMessage('Comment posted.');
    await loadPraises();
  }

  async function deletePraise(praiseId: any) {
    if (!confirm('Delete this praise report?')) return;
    await supabase.from('comments').delete().eq('content_type', 'praise').eq('content_id', praiseId);
    await supabase.from('praise_reactions').delete().eq('praise_id', praiseId);
    const { error } = await supabase.from('praise_reports').delete().eq('id', praiseId).eq('user_id', userId);
    if (error) return setMessage(error.message);
    setMessage('Praise report deleted.');
    await loadPraises();
  }

  if (loading) return <main className="container section"><p>Loading...</p></main>;
  if (!userId) return <main className="container section"><p className="eyebrow">Members Only</p><h1>Join EKKO to view Praise Reports.</h1><p>Praise reports are part of the private EKKO community.</p><a className="btn primary" href="/signup">Create Account</a><a className="btn" href="/login">Login</a></main>;

  return (
    <main className="container section">
      <div className="hero-actions"><p className="eyebrow">Praise Reports</p><button className="btn primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Share Praise'}</button></div>
      <h1>Celebrate what God is doing.</h1>
      <p>Share testimonies, answered prayers, breakthrough, provision, and moments of God's faithfulness.</p>
      {message && <div className="notice-card">{message}</div>}
      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Praise report title" required />
          <select name="category"><option>Answered Prayer</option><option>Provision</option><option>Healing</option><option>Family</option><option>Faith</option><option>Breakthrough</option></select>
          <textarea name="body" placeholder="What did God do?" required />
          <button className="btn primary" type="submit">Share Praise</button>
        </form>
      )}
      <div className="feed">
        {praises.map((praise) => {
          const counts = reactionCounts[String(praise.id)] || {};
          const praiseComments = comments[String(praise.id)] || [];
          const isOwner = praise.user_id === userId;
          return (
            <div className="post" key={praise.id}>
              <small>{praise.category || 'Praise Report'}</small><h3>{praise.title}</h3><p>{praise.body}</p>
              <div className="reaction-row">
                <button className="reaction-btn" onClick={() => addReaction(praise.id, 'praise_god')}>🙌 Praise God ({counts.praise_god || 0})</button>
                <button className="reaction-btn" onClick={() => addReaction(praise.id, 'encouraged')}>❤️ Encouraged ({counts.encouraged || 0})</button>
                <span className="reaction-btn">💬 {praiseComments.length} Comments</span>
                {isOwner && <button className="reaction-btn" onClick={() => deletePraise(praise.id)}>Delete</button>}
              </div>
              <div className="comment-list">{praiseComments.map((comment) => <p key={comment.id}>💬 {comment.body}</p>)}</div>
              <form className="comment-form" onSubmit={(event) => addComment(event, praise.id)}><input name="comment" placeholder="Celebrate or encourage..." /><button className="btn" type="submit">Comment</button></form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
