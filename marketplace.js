window.MarketplacePage = {
  mount(root){
    root.innerHTML = `
      <section class="setup-screen">
        <div class="card">
          <h1>Marketplace</h1>
          <p>Discover new training packs and scenario bundles curated for enterprise teams.</p>
          <a href="#/game" class="btn-primary">Start Simulation</a>
        </div>
      </section>
    `;
  },
  unmount(){}
};
