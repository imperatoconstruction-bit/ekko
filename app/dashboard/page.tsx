'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [prayers, setPrayers] = useState<any[]>([]);
  const [praises, setPraises] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = '/login';
        return;
      }
      setEmail(userData.user.email || '');
      const { data: prayerData } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(3);
      const { data: praiseData } = await supabase.from('praise_reports').select('*').order('created_at', { ascending: false }).limit(3);
      setPrayers(prayerData || []);
      setPraises(praiseData || []);
    }
    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <main className="container section">
      <p className="eyebrow">Member dashboard</p>
      <h1>Welcome to EKKO.</h1>
      <p>{email}</p>
      <button className="btn" onClick={logout}>Logout</button>
      <div className="dashboard section">
        <div className="card">
          <h2>Today's Word</h2>
          <p>Hebrews 10:24-25 — Stir one another up to love and good works.</p>
          <a className="btn primary" href="/prayer">Share Prayer</a>
        </div>
        <div className="card">
          <h2>Share Praise</h2>
          <p>Tell the community what God is doing in your life.</p>
          <a className="btn primary" href="/praise">Praise Report</a>
        </div>
      </div>
      <section className="cards">
        <div className="card"><h3>Recent Prayers</h3>{prayers.map(p => <p key={p.id}>{p.title}</p>)}</div>
        <div className="card"><h3>Recent Praise</h3>{praises.map(p => <p key={p.id}>{p.title}</p>)}</div>
        <div className="card"><h3>Community</h3><p>Post reflections, questions, and testimonies.</p><a href="/community">Open Community</a></div>
      </section>
    </main>
  );
}
