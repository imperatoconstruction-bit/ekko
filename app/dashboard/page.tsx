'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      setEmail(data.user.email || '');
    }
    loadUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <main className="container section">
      <p className="eyebrow">Member Dashboard</p>
      <h1>Welcome to EKKO.</h1>
      <p>{email}</p>
      <button className="btn" onClick={logout}>Logout</button>
      <section className="dashboard section">
        <div className="card">
          <h2>Prayer Wall</h2>
          <p>Share a request and invite the community to pray with you.</p>
          <a className="btn primary" href="/prayer">Share Prayer</a>
        </div>
        <div className="card">
          <h2>Praise Reports</h2>
          <p>Celebrate what God is doing in your life.</p>
          <a className="btn primary" href="/praise">Share Praise</a>
        </div>
      </section>
      <section className="cards">
        <div className="card"><h3>Community</h3><p>Post reflections, questions, and testimonies.</p><a href="/community">Open Community</a></div>
        <div className="card"><h3>Daily Word</h3><p>Hebrews 10:24-25 — Stir one another up to love and good works.</p></div>
        <div className="card"><h3>Groups</h3><p>Groups are coming soon.</p></div>
      </section>
    </main>
  );
}
