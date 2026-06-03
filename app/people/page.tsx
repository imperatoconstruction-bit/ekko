'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PeoplePage() {
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    async function loadPeople() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = '/login';
        return;
      }
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setPeople(data || []);
      setLoading(false);
    }
    loadPeople();
  }, []);

  if (loading) return <main className="container section"><p>Loading people...</p></main>;

  return (
    <main className="container section">
      <p className="eyebrow">People</p>
      <h1>Meet the EKKO community.</h1>
      <p>Discover members, read their stories, and connect around prayer, testimony, and discipleship.</p>
      <div className="cards" style={{ marginTop: '40px' }}>
        {people.map((person) => (
          <a className="card" href={`/member/${person.id}`} key={person.id}>
            {person.photo_url ? <img src={person.photo_url} alt="Profile" className="profile-photo" /> : <div className="profile-photo placeholder">{(person.first_name || 'E').charAt(0)}</div>}
            <h3>{person.first_name || person.display_name || 'EKKO Member'}</h3>
            <p>{person.location || 'EKKO Community'}</p>
            <p>{person.bio || 'Building authentic Jesus-centered community.'}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
