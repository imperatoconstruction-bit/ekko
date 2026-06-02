export default function Nav() {
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
          <a href="/login">Login</a>
          <a className="nav-cta" href="/signup">Join</a>
        </div>
      </nav>
    </header>
  );
}
