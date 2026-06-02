export default function HomePage() {
  return (
    <main>
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
            <a href="/login">Login</a>
            <a className="nav-cta" href="/signup">Join</a>
          </div>
        </nav>
      </header>

      <section className="section hero-section">
        <div className="container grid">
          <div>
            <p className="eyebrow">ekkojoin.com</p>
            <h1>More than a platform. A place to belong.</h1>
            <p>
              EKKO is a Jesus-centered community movement for prayer, praise reports,
              Scripture, groups, events, and authentic connection.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="/signup">Join the Movement</a>
              <a className="btn" href="/login">Member Login</a>
            </div>
          </div>
          <div className="card hero-card">
            <p className="eyebrow">Faith was never meant to be lived alone.</p>
            <h2>Connect. Grow. Gather. Go.</h2>
            <p>
              Build community around prayer, testimony, Scripture, honest conversation,
              and real belonging.
            </p>
          </div>
        </div>
      </section>

      <section id="platform" className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">The digital community</p>
            <h2>Simple tools for real spiritual connection.</h2>
            <p>
              EKKO is not another noisy social app. It is a focused space where believers
              can pray, grow, talk honestly, gather, and celebrate what God is doing.
            </p>
          </div>
          <div className="cards">
            <div className="card"><h3>Prayer Wall</h3><p>Share requests and invite the community to pray with you.</p><a href="/prayer">Open Prayer Wall</a></div>
            <div className="card"><h3>Praise Reports</h3><p>Celebrate answered prayer, breakthrough, provision, and testimony.</p><a href="/praise">Share Praise</a></div>
            <div className="card"><h3>Community Feed</h3><p>Post reflections, questions, Scripture, and honest conversations.</p><a href="/community">Open Community</a></div>
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container grid">
          <div className="card">
            <p className="eyebrow">Prayer Wall</p>
            <h2>Carry burdens together.</h2>
            <p>
              A place for requests, encouragement, and a community that actually stands
              in the gap together.
            </p>
            <a className="btn primary" href="/prayer">Share a Prayer</a>
          </div>
          <div className="feed">
            <div className="post"><small>Prayer Request</small><h3>Pray for wisdom this week</h3><p>Making a big decision and asking God for clarity.</p></div>
            <div className="post"><small>Answered Prayer</small><h3>God opened the door</h3><p>What I was praying for finally came through.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          <div>
            <p className="eyebrow">Praise reports</p>
            <h2>Build a culture of testimony.</h2>
            <p>
              EKKO is not only a place to bring burdens. It is a place to remember,
              celebrate, and share what God is doing in real lives.
            </p>
            <a className="btn primary" href="/praise">Share a Praise Report</a>
          </div>
          <div className="card">
            <h3>What God did this week</h3>
            <p>Answered prayer. Healing. Provision. Breakthrough. Restored faith.</p>
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">The movement</p>
            <h2>Online connection that leads to real community.</h2>
          </div>
          <div className="cards">
            <div className="card"><h3>Connect</h3><p>Prayer, posts, questions, and testimonies.</p></div>
            <div className="card"><h3>Grow</h3><p>Daily Word, devotionals, Scripture, and discipleship rhythms.</p></div>
            <div className="card"><h3>Gather</h3><p>Groups, events, prayer nights, and conferences.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          <div className="card">
            <p className="eyebrow">Featured resource</p>
            <h2>The Church Isn't For Me.</h2>
            <p>
              A new book by Brandon Imperato about rediscovering what the church was
              meant to be. Coming Summer 2026.
            </p>
            <a className="btn primary" href="/book">Explore the Book</a>
          </div>
          <div>
            <p className="eyebrow">Resources</p>
            <h2>Tools for faith that echoes.</h2>
            <p>
              Books, devotionals, group guides, and resources designed to move people
              from information to formation.
            </p>
            <a className="btn" href="/resources">View Resources</a>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <p className="eyebrow">Join EKKO</p>
          <h2>Be part of something real.</h2>
          <p>Join the movement and help build authentic Jesus-centered community.</p>
          <a className="btn primary" href="/signup">Create Account</a>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>EKKO · More than a platform. A place to belong.</p>
        </div>
      </footer>
    </main>
  );
}
