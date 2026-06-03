'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);

  async function loadPosts() {
    const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    const ids = (data || []).map((post) => post.id);
    const userIds = Array.from(new Set((data || []).map((post) => post.user_id).filter(Boolean)));
    if (userIds.length > 0) {
      const { data: profileData } = await supabase.from('profiles').select('*').in('id', userIds);
      const profileMap: Record<string, any> = {};
      (profileData || []).forEach((profile) => { profileMap[profile.id] = profile; });
      setProfiles(profileMap);
    }
    if (ids.length > 0) {
      const { data: reactions } = await supabase.from('community_reactions').select('*').in('post_id', ids);
      const counts: Record<string, Record<string, number>> = {};
      (reactions || []).forEach((reaction) => {
        const postId = String(reaction.post_id);
        if (!counts[postId]) counts[postId] = {};
        counts[postId][reaction.reaction_type] = (counts[postId][reaction.reaction_type] || 0) + 1;
      });
      setReactionCounts(counts);
      const { data: commentData } = await supabase.from('comments').select('*').eq('content_type', 'community').in('content_id', ids).order('created_at', { ascending: true });
      const grouped: Record<string, any[]> = {};
      (commentData || []).forEach((comment) => {
        const key = String(comment.content_id);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(comment);
      });
      setComments(grouped);
    } else {
      setReactionCounts({});
      setComments({});
    }
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setLoading(false); return; }
      setUserId(data.user.id);
      await loadPosts();
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const body = String(form.get('body'));
    const post_type = String(form.get('post_type') || 'discussion');
    if (!userId) return (window.location.href = '/login');
    const { error } = await supabase.from('community_posts').insert({ user_id: userId, title, body, post_type });
    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setShowForm(false);
    setMessage('Post shared successfully.');
    await loadPosts();
  }

  async function addReaction(postId: any, reactionType: string) {
    if (!userId) return (window.location.href = '/login');
    const { error } = await supabase.from('community_reactions').insert({ post_id: postId, user_id: userId, reaction_type: reactionType });
    if (error) return setMessage(error.message);
    setMessage('Reaction added.');
    await loadPosts();
  }

  async function addComment(event: React.FormEvent<HTMLFormElement>, postId: any) {
    event.preventDefault();
    if (!userId) return (window.location.href = '/login');
    const form = new FormData(event.currentTarget);
    const body = String(form.get('comment'));
    if (!body.trim()) return;
    const { error } = await supabase.from('comments').insert({ user_id: userId, content_type: 'community', content_id: postId, body });
    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setMessage('Comment posted.');
    await loadPosts();
  }

  async function deletePost(postId: any) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('comments').delete().eq('content_type', 'community').eq('content_id', postId);
    await supabase.from('community_reactions').delete().eq('post_id', postId);
    const { error } = await supabase.from('community_posts').delete().eq('id', postId).eq('user_id', userId);
    if (error) return setMessage(error.message);
    setMessage('Post deleted.');
    await loadPosts();
  }

  if (loading) return <main className="container section"><p>Loading...</p></main>;
  if (!userId) return <main className="container section"><p className="eyebrow">Members Only</p><h1>Join EKKO to access the Community Feed.</h1><p>The community feed is private for EKKO members.</p><a className="btn primary" href="/signup">Create Account</a><a className="btn" href="/login">Login</a></main>;

  return (
    <main className="container section">
      <div className="hero-actions"><p className="eyebrow">Community Feed</p><button className="btn primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Post'}</button></div>
      <h1>Community</h1>
      <p>Share Scripture, ask questions, start discussions, and encourage the EKKO community.</p>
      {message && <div className="notice-card">{message}</div>}
      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" required />
          <select name="post_type"><option value="discussion">Discussion</option><option value="scripture">Scripture Reflection</option><option value="question">Question</option><option value="testimony">Testimony</option></select>
          <textarea name="body" placeholder="Share something..." required />
          <button className="btn primary" type="submit">Post</button>
        </form>
      )}
      <div className="feed">
        {posts.map((post) => {
          const profile = profiles[post.user_id] || {};
          const name = profile.first_name || profile.display_name || 'EKKO Member';
          const counts = reactionCounts[String(post.id)] || {};
          const postComments = comments[String(post.id)] || [];
          const isOwner = post.user_id === userId;
          return (
            <div className="post" key={post.id}>
              <div className="post-author"><div className="avatar-chip">{name.charAt(0)}</div><div><strong>{name}</strong><p>{profile.location || 'EKKO Community'}</p></div></div>
              <small>{post.post_type || 'Community'}</small><h3>{post.title}</h3><p>{post.body}</p>
              <div className="reaction-row">
                <button className="reaction-btn" onClick={() => addReaction(post.id, 'encourage')}>❤️ Encourage ({counts.encourage || 0})</button>
                <button className="reaction-btn" onClick={() => addReaction(post.id, 'scripture')}>📖 Scripture ({counts.scripture || 0})</button>
                <span className="reaction-btn">💬 {postComments.length} Comments</span>
                {isOwner && <button className="reaction-btn" onClick={() => deletePost(post.id)}>Delete</button>}
              </div>
              <div className="comment-list">{postComments.map((comment) => <p key={comment.id}>💬 {comment.body}</p>)}</div>
              <form className="comment-form" onSubmit={(event) => addComment(event, post.id)}><input name="comment" placeholder="Add to the conversation..." /><button className="btn" type="submit">Comment</button></form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
