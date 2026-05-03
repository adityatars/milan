window.LeaderboardPage = {
  mount(root){
    root.innerHTML = `
      <section class="setup-screen">
        <div class="card">
          <h1>Leaderboard</h1>
          <p>Track top performers, benchmark outcomes, and compete with your cohort.</p>
          <a href="#/home" class="btn-outline">Back to Home</a>
        </div>
      </section>
    `;
  },
  unmount(){}
};
