'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [praises, setPraises] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      setEmail(data.user.email || '');
      const [{ data: prayerData }, { data: praiseData }, { data: postData }] = await Promise.all([
        supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('praise_reports').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(3)
      ]);
      setPrayers(prayerData || []);
      setPraises(praiseData || []);
      setPosts(postData || []);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) return <main className="container section"><p>Loading dashboard...</p></main>;

  return (
    <main className="container section">
      <p className="eyebrow">Member Dashboard</p>
      <h1>Welcome back.</h1>
      <p>{email}</p>
      <button className="btn" onClick={logout}>Logout</button>

      <section className="dashboard section">
        <div className="card">
          <p className="eyebrow">Today&apos;s Word</p>
          <h2>Stir one another up.</h2>
          <p>Hebrews 10:24-25 — Let us consider how to stir up one another to love and good works.</p>
          <a className="btn primary" href="/community">Reflect with the community</a>
        </div>
        <div className="card">
          <p className="eyebrow">Quick Actions</p>
          <h2>What do you want to share?</h2>
          <a className="btn primary" href="/prayer">Prayer Request</a>
          <a className="btn" href="/praise">Praise Report</a>
          <a className="btn" href="/community">Community Post</a>
        </div>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Recent Prayers</h3>
          {prayers.length === 0 ? <p>No prayer requests yet.</p> : prayers.map((item) => <p key={item.id}>{item.title}</p>)}
          <a href="/prayer">Open Prayer Wall</a>
        </div>
        <div className="card">
          <h3>Recent Praise</h3>
          {praises.length === 0 ? <p>No praise reports yet.</p> : praises.map((item) => <p key={item.id}>{item.title}</p>)}
          <a href="/praise">Open Praise Reports</a>
        </div>
        <div className="card">
          <h3>Community Activity</h3>
          {posts.length === 0 ? <p>No community posts yet.</p> : posts.map((item) => <p key={item.id}>{item.title}</p>)}
          <a href="/community">Open Community</a>
        </div>
      </section>

      <section className="section">
        <div className="cards">
          <div className="card"><h3>Upcoming Events</h3><p>Prayer nights, worship nights, and community gatherings are coming soon.</p></div>
          <div className="card"><h3>Groups Near You</h3><p>Young families, young adults, prayer circles, and discipleship groups are coming soon.</p></div>
          <div className="card"><h3>Your Profile</h3><p>Profile pages are coming next so members can be known and connected.</p><a href="/profile">View Profile</a></div>
        </div>
      </section>
    </main>
  );
}
