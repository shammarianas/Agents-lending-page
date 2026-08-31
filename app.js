/* ============================================================
   COMPONENTS — small functions that return HTML strings.
   Reuse these instead of rewriting markup for each product.
   PRODUCTS comes from data.js, which is loaded before this file.
   ============================================================ */
function ProductCard(p){
  return `
    <article class="card" tabindex="0" data-id="${p.id}" role="button" aria-label="View ${p.name}">
      <img class="card-img" src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="card-body">
        <span class="card-tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.tagline}</p>
        <span class="card-link">View details
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </article>`;
}

function FeatureItem(text){
  return `
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${text}</span>
    </li>`;
}

function ProductDetail(p){
  return `
    <span class="detail-tag">${p.tag}</span>
    <h1 class="detail-title">${p.name}</h1>
    <p class="lead-p">${p.lead}</p>
    <img class="detail-hero-img" src="${p.image}" alt="${p.name}" />

    <div class="detail-body">
      <div>
        ${p.body.map(par => `<p>${par}</p>`).join("")}
        <h3>What it does</h3>
        <ul class="feature-list">
          ${p.features.map(FeatureItem).join("")}
        </ul>
        <div class="gallery">
          ${p.gallery.map(src => `<img src="${src}" alt="${p.name} in use" loading="lazy" />`).join("")}
        </div>
      </div>

      <aside class="detail-side">
        <h4>Quick facts</h4>
        <div class="side-row"><span>Setup time</span><span>${p.setup}</span></div>
        <div class="side-row"><span>Category</span><span>${p.tag}</span></div>
        <div class="side-row"><span>Integrations</span><span>${p.integrations}</span></div>
        <a class="side-cta" href="https://wa.me/971528036012" target="_blank" rel="noopener">Book a demo</a>
      </aside>
    </div>
  `;
}

/* ============================================================
   RENDER + STATE
   ============================================================ */
const grid = document.getElementById("productGrid");
const mainView = document.getElementById("mainView");
const detailView = document.getElementById("detailView");
const detailContent = document.getElementById("detailContent");
const searchInput = document.getElementById("searchInput");

function renderGrid(list){
  grid.innerHTML = list.length
    ? list.map(ProductCard).join("")
    : `<div class="no-results">No agents match "${searchInput.value}". Try a different search.</div>`;

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
    card.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openDetail(card.dataset.id); }
    });
  });
}

function openDetail(id){
  const product = PRODUCTS.find(p => p.id === id);
  if(!product) return;
  detailContent.innerHTML = ProductDetail(product);
  mainView.classList.add("hidden");
  detailView.classList.add("active");
  window.scrollTo({top:0, behavior:"instant"});
}

function closeDetail(){
  detailView.classList.remove("active");
  mainView.classList.remove("hidden");
  window.scrollTo({top:0, behavior:"instant"});
}

document.getElementById("backLink").addEventListener("click", e => { e.preventDefault(); closeDetail(); });
document.getElementById("logoHome").addEventListener("click", closeDetail);

searchInput.addEventListener("input", () => {
  if(detailView.classList.contains("active")) closeDetail();
  const q = searchInput.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q)
  );
  renderGrid(filtered);
});

renderGrid(PRODUCTS);