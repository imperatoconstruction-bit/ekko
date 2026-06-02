'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<any>({});
  const [prayers, setPrayers] = useState<any[]>([]);
  const [praises, setPraises] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      setUserId(data.user.id);
      const [{ data: profileData }, { data: prayerData }, { data: praiseData }, { data: postData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('prayer_requests').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('praise_reports').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('community_posts').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5)
      ]);
      setProfile(profileData || {});
      setPrayers(prayerData || []);
      setPraises(praiseData || []);
      setPosts(postData || []);
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;
    const form = new FormData(event.currentTarget);
    const updates = {
      id: userId,
      first_name: String(form.get('first_name') || ''),
      last_name: String(form.get('last_name') || ''),
      display_name: String(form.get('first_name') || ''),
      location: String(form.get('location') || ''),
      bio: String(form.get('bio') || ''),
      favorite_verse: String(form.get('favorite_verse') || ''),
      photo_url: String(form.get('photo_url') || '')
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) return setMessage(error.message);
    setMessage('Profile updated.');
    setProfile(updates);
  }

  if (loading) return <main className="container section"><p>Loading profile...</p></main>;

  return (
    <main className="container section">
      <div className="hero-actions">
        <a className="btn" href="/dashboard">Dashboard</a>
        <a className="btn" href="/community">Community</a>
        <a className="btn" href="/prayer">Prayer Wall</a>
      </div>

      <section className="grid">
        <div className="card">
          <p className="eyebrow">Your Profile</p>
          <h1>{profile.first_name || 'Profile'}</h1>
          <p>{profile.location}</p>
          {profile.photo_url ? <img src={profile.photo_url} alt="Profile" className="profile-photo" /> : <div className="profile-photo placeholder">{(profile.first_name || 'E').charAt(0)}</div>}
          <p>{profile.bio}</p>
          <p><strong>Favorite Verse:</strong> {profile.favorite_verse || 'Add one below.'}</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <p className="eyebrow">Edit Profile</p>
          <input name="first_name" placeholder="First name" defaultValue={profile.first_name || ''} />
          <input name="last_name" placeholder="Last name" defaultValue={profile.last_name || ''} />
          <input name="location" placeholder="City / State" defaultValue={profile.location || ''} />
          <input name="photo_url" placeholder="Profile photo URL" defaultValue={profile.photo_url || ''} />
          <input name="favorite_verse" placeholder="Favorite verse" defaultValue={profile.favorite_verse || ''} />
          <textarea name="bio" placeholder="Tell the EKKO community a little about you..." defaultValue={profile.bio || ''} />
          <button className="btn primary" type="submit">Save Profile</button>
          <p>{message}</p>
        </form>
      </section>

      <section className="section">
        <p className="eyebrow">Your Activity</p>
        <div className="cards">
          <div className="card"><h3>Prayer Requests</h3>{prayers.length === 0 ? <p>No prayer requests yet.</p> : prayers.map((item) => <p key={item.id}>{item.title}</p>)}</div>
          <div className="card"><h3>Praise Reports</h3>{praises.length === 0 ? <p>No praise reports yet.</p> : praises.map((item) => <p key={item.id}>{item.title}</p>)}</div>
          <div className="card"><h3>Community Posts</h3>{posts.length === 0 ? <p>No community posts yet.</p> : posts.map((item) => <p key={item.id}>{item.title}</p>)}</div>
        </div>
      </section>
    </main>
  );
}
