export default function VisionPage() {
  return (
    <main>
      <header className="site-header">
        <nav className="nav container">
          <a className="brand" href="/">EKKO</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/community">Community</a>
            <a href="/prayer">Prayer</a>
            <a href="/signup" className="nav-cta">Join</a>
          </div>
        </nav>
      </header>

      <section className="section hero-section">
        <div className="container grid">
          <div>
            <p className="eyebrow">The Vision</p>
            <h1>Move people from isolation to authentic Jesus-centered community.</h1>
          </div>
          <div className="card">
            <p>EKKO exists because people are more connected than ever, but many are still spiritually alone. The vision is to build a movement that helps people connect, grow, gather, and go together.</p>
            <a className="btn primary" href="/signup">Join the Movement</a>
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container cards">
          <div className="card"><h3>The Problem</h3><p>Faith content is everywhere, but spiritual family is harder to find.</p></div>
          <div className="card"><h3>The Solution</h3><p>A focused community space for prayer, Scripture, testimony, groups, and gatherings.</p></div>
          <div className="card"><h3>The Future</h3><p>A movement that lives online, gathers locally, and echoes globally.</p></div>
        </div>
      </section>
    </main>
  );
}
