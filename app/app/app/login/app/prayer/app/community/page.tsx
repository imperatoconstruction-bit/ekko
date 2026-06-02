'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  async function loadPosts() {
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    setPosts(data || []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const title = String(form.get('title'));
    const body = String(form.get('body'));

    const { data: userData } =
      await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = '/login';
      return;
    }

    const { error } =
      await supabase
        .from('community_posts')
        .insert({
          user_id: userData.user.id,
          title,
          body,
          post_type: 'discussion'
        });

    if (error) {
      setMessage(error.message);
      return;
    }

    event.currentTarget.reset();
    setMessage('Post shared.');
    loadPosts();
  }

  return (
    <main className="container section">
      <p className="eyebrow">
        Community Feed
      </p>

      <h1>Community</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          required
        />

        <textarea
          name="body"
          placeholder="Share something..."
          required
        />

        <button
          className="btn primary"
          type="submit"
        >
          Post
        </button>

        <p>{message}</p>
      </form>

      <div className="feed">
        {posts.map(post => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
