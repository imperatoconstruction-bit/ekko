export default function BookPage() {
  return (
    <main className="container section">
      <p className="eyebrow">Featured Book</p>
      <h1>The Church Isn't For Me.</h1>
      <p>Rediscovering what the church was meant to be.</p>

      <div className="grid" style={{marginTop:'40px'}}>
        <div className="card">
          <h2>Coming Summer 2026</h2>
          <p>A call back to biblical community, discipleship, presence, and mission.</p>
        </div>
        <div className="card">
          <h3>Inside the Book</h3>
          <p>What Jesus intended. How the church drifted. What the church must return to.</p>
          <a className="btn primary" href="/signup">Join Launch Updates</a>
        </div>
      </div>
    </main>
  );
}
