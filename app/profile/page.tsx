'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
        return;
      }
      setUserId(data.user.id);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      setProfile(profileData || {});
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
      display_name: String(form.get('display_name') || ''),
      location: String(form.get('location') || ''),
      bio: String(form.get('bio') || ''),
      favorite_verse: String(form.get('favorite_verse') || '')
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) return setMessage(error.message);
    setMessage('Profile updated.');
    setProfile(updates);
  }

  if (loading) return <main className="container section"><p>Loading profile...</p></main>;

  return (
    <main className="container section">
      <p className="eyebrow">Your Profile</p>
      <h1>{profile.display_name || profile.first_name || 'Profile'}</h1>
      <p>{profile.location}</p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First name" defaultValue={profile.first_name || ''} />
        <input name="last_name" placeholder="Last name" defaultValue={profile.last_name || ''} />
        <input name="display_name" placeholder="Display name" defaultValue={profile.display_name || ''} />
        <input name="location" placeholder="City / State" defaultValue={profile.location || ''} />
        <input name="favorite_verse" placeholder="Favorite verse" defaultValue={profile.favorite_verse || ''} />
        <textarea name="bio" placeholder="Tell the EKKO community a little about you..." defaultValue={profile.bio || ''} />
        <button className="btn primary" type="submit">Save Profile</button>
        <p>{message}</p>
      </form>
    </main>
  );
}
