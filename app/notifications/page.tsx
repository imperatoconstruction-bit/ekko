'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }

      const [{ data: prayers }, { data: praises }, { data: posts }] = await Promise.all([
        supabase.from('prayer_requests').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('praise_reports').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('community_posts').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      const notes: string[] = [];
      (prayers || []).forEach((item) => notes.push(`Your prayer request “${item.title}” is live on the Prayer Wall.`));
      (praises || []).forEach((item) => notes.push(`Your praise report “${item.title}” is live on the Praise Wall.`));
      (posts || []).forEach((item) => notes.push(`Your community post “${item.title}” is live in the Community Feed.`));
      setItems(notes);
      setLoading(false);
    }
    loadNotifications();
  }, []);

  if (loading) return <main className="container section"><p>Loading notifications...</p></main>;

  return (
    <main className="container section">
      <p className="eyebrow">Notifications</p>
      <h1>What&apos;s happening.</h1>
      <div className="feed">
        {items.length === 0 ? <div className="notice-card">No notifications yet. Start praying, posting, or sharing praise.</div> : items.map((item, index) => <div className="notice-card" key={index}>🔔 {item}</div>)}
      </div>
    </main>
  );
}
