'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function MemberPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [praises, setPraises] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadMember() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = '/login';
        return;
      }

      const [{ data: profileData }, { data: prayerData }, { data: praiseData }, { data: postData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', params.id).single(),
        supabase.from('prayer_requests').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(6),
        supabase.from('praise_reports').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(6),
        supabase.from('community_posts').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(6)
      ]);

      setProfile(profileData);
      setPrayers(prayerData || []);
      setPraises(praiseData || []);
      setPosts(postData || []);
      setLoading(false);
    }
    loadMember();
  }, [params.id]);

  if (loading) return <main className="container section"><p>Loading member...</p></main>;
  if (!profile) return <main className="container section"><h1>Member not found.</h1><a className="btn" href="/people">Back to People</a></main>;

  const name = profile.first_name || profile.display_name || 'EKKO Member';

  return (
    <main className="container section">
      <div className="hero-actions"><a className="btn" href="/people">People</a><a className="btn" href="/community">Community</a></div>
      <section className="grid">
        <div className="card">
          {profile.photo_url ? <img src={profile.photo_url} alt="Profile" className="profile-photo" /> : <div className="profile-photo placeholder">{name.charAt(0)}</div>}
          <p className="eyebrow">Member Profile</p>
          <h1>{name}</h1>
          <p>{profile.location || 'EKKO Community'}</p>
          <p>{profile.bio || 'Building authentic Jesus-centered community.'}</p>
          <p><strong>Favorite Verse:</strong> {profile.favorite_verse || 'Not added yet.'}</p>
        </div>
        <div className="card">
          <p className="eyebrow">Community Snapshot</p>
          <h2>{prayers.length + praises.length + posts.length} recent contributions</h2>
          <p>Prayer requests, praise reports, and community posts from this member.</p>
        </div>
      </section>

      <section className="section">
        <div className="cards">
          <div className="card"><h3>Prayer Requests</h3>{prayers.length === 0 ? <p>No prayer requests yet.</p> : prayers.map((item) => <p key={item.id}>🙏 {item.title}</p>)}</div>
          <div className="card"><h3>Praise Reports</h3>{praises.length === 0 ? <p>No praise reports yet.</p> : praises.map((item) => <p key={item.id}>🙌 {item.title}</p>)}</div>
          <div className="card"><h3>Community Posts</h3>{posts.length === 0 ? <p>No community posts yet.</p> : posts.map((item) => <p key={item.id}>💬 {item.title}</p>)}</div>
        </div>
      </section>
    </main>
  );
}
