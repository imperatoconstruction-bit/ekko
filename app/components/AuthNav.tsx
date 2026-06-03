'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setLoggedIn(!!data.user);
    }
    checkUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="site-header">
      <nav className="nav container">
        <a className="brand" href="/">EKKO</a>
        <div className="nav-links">
          <a href="/vision">Vision</a>
          <a href="/about">About</a>
          <a href="/resources">Resources</a>
          <a href="/book">Book</a>
          <a href="/groups">Groups</a>
          <a href="/community">Community</a>
          <a href="/prayer">Prayer</a>
          <a href="/praise">Praise</a>
          {loggedIn && <a href="/dashboard">Dashboard</a>}
          {loggedIn && <a href="/profile">Profile</a>}
          {loggedIn ? <button className="nav-button" onClick={logout}>Logout</button> : <a href="/login">Login</a>}
          {!loggedIn && <a className="nav-cta" href="/signup">Join EKKO</a>}
        </div>
      </nav>
    </header>
  );
}
