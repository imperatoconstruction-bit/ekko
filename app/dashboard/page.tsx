'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('friend');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [praises, setPraises] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [devotional, setDevotional] = useState<any>(null);

  useEffect(() => {
    async function loadDashboard() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      setEmail(data.user.email || '');
      const [{ data: profile }, { data: prayerData }, { data: praiseData }, { data: postData }, { data: devotionalData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('praise_reports').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('daily_devotionals').select('*').eq('devotional_date', today).maybeSingle()
      ]);
      setDisplayName(profile?.display_name || profile?.first_name || 'friend');
      setLocation(profile?.location || '');
      setPrayers(prayerData || []);
      setPraises(praiseData || []);
      setPosts(postData || []);
      setDevotional(devotionalData || null);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) return <main className="container section"><p>Loading dashboard...</p></main>;

  const notifications = [
    prayers.length > 0 ? `${prayers.length} recent prayer request${prayers.length > 1 ? 's' : ''} need covering.` : 'No prayer requests yet. Be the first to share or pray.',
    praises.length > 0 ? `${praises.length} praise report${praises.length > 1 ? 's' : ''} are waiting to be celebrated.` : 'No praise reports yet. Share what God is doing.',
    posts.length > 0 ? `${posts.length} community conversation${posts.length > 1 ? 's' : ''} are active.` : 'No community posts yet. Start a conversation.'
  ];

  return (
    <main className="container section">
      <section className="grid">
        <div>
          <p className="eyebrow">Member Home</p>
          <h1>Good to see you, {displayName}.</h1>
          <p>{location ? location : email}</p>
          <div className="hero-actions">
            <a className="btn primary" href="/prayer">Prayer Request</a>
            <a className="btn" href="/praise">Praise Report</a>
            <a className="btn" href="/community">Community Post</a>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
        <div className="card">
          <p className="eyebrow">Today&apos;s Word</p>
          <h2>{devotional?.title || 'Stir one another up.'}</h2>
          <p><strong>{devotional?.verse_reference || 'Hebrews 10:24-25'}</strong></p>
          <p>{devotional?.verse_text || 'Let us consider how to stir up one another to love and good works.'}</p>
          {devotional?.devotional && <p>{devotional.devotional}</p>}
          {devotional?.reflection_question && <p><strong>Reflect:</strong> {devotional.reflection_question}</p>}
          {devotional?.prayer && <p><strong>Prayer:</strong> {devotional.prayer}</p>}
          {devotional?.action_step && <p><strong>Action:</strong> {devotional.action_step}</p>}
          <a className="btn primary" href="/community">Reflect with the community</a>
        </div>
      </section>

      <section className="section">
        <div className="cards">
          {notifications.map((note, index) => <div className="notice-card" key={index}>{note}</div>)}
        </div>
      </section>

      <section className="dashboard">
        <div className="card">
          <h3>Recent Prayer Activity</h3>
          {prayers.length === 0 ? <p>No prayer requests yet.</p> : prayers.map((item) => <p key={item.id}>🙏 {item.title}</p>)}
          <a href="/prayer">Open Prayer Wall</a>
        </div>
        <div className="card">
          <h3>Recent Praise Activity</h3>
          {praises.length === 0 ? <p>No praise reports yet.</p> : praises.map((item) => <p key={item.id}>🙌 {item.title}</p>)}
          <a href="/praise">Open Praise Reports</a>
        </div>
      </section>

      <section className="section">
        <div className="cards">
          <div className="card">
            <h3>Community Discussions</h3>
            {posts.length === 0 ? <p>No community posts yet.</p> : posts.map((item) => <p key={item.id}>💬 {item.title}</p>)}
            <a href="/community">Open Community</a>
          </div>
          <div className="card"><h3>Groups Near You</h3><p>Young families, young adults, prayer circles, and discipleship groups are coming soon.</p><a href="/groups">Explore Groups</a></div>
          <div className="card"><h3>Your Profile</h3><p>Update your bio, location, favorite verse, and profile photo.</p><a href="/profile">View Profile</a></div>
        </div>
      </section>
    </main>
  );
}
