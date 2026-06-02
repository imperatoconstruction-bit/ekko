export default function ResourcesPage() {
  return (
    <main>
      <header className="site-header"><nav className="nav container"><a className="brand" href="/">EKKO</a><div className="nav-links"><a href="/vision">Vision</a><a href="/book">Book</a><a href="/groups">Groups</a><a className="nav-cta" href="/signup">Join</a></div></nav></header>
      <section className="section hero-section"><div className="container grid"><div><p className="eyebrow">Resources</p><h1>Tools for faith that echoes.</h1><p>Books, devotionals, group guides, podcasts, and resources designed to move people from information to formation.</p></div><div className="card"><h2>EKKO Library</h2><p>Resources that help people connect, grow, gather, and go.</p></div></div></section>
      <section className="section alt-section"><div className="container cards"><div className="card"><h3>Books</h3><p>Faith-based resources including The Church Isn't For Me.</p></div><div className="card"><h3>Devotionals</h3><p>Daily Scripture, reflection, prayer prompts, and discussion questions.</p></div><div className="card"><h3>Group Guides</h3><p>Conversation tools for small groups, families, and discipleship circles.</p></div></div></section>
    </main>
  );
}
