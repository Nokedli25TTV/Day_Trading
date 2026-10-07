// Ismétlés: az esedékes kártyák egyenként, önértékeléssel. Billentyűk: szóköz = válasz, 1 = nem tudtam, 2 = tudtam.
import { state, commit, onRender, recordActivity } from "../store.js";
import { reviewCards } from "../review-deck.js";
import { gradeCard, dueCards, nextUpcoming } from "../logic/review.js";
import { getCurrentView } from "../router.js";
import { currentTab } from "../tabs.js";
import { $, setText, escapeHTML, formatInline, localDateKey, shortDate } from "../util.js";

// queue: a mai kör kártyái; again: amit ma már egyszer elrontottál.
let session = { queue: [], revealed: false, done: 0, again: new Set() };

function renderReview(focus = false) {
  const content = $("#review-content");
  const today = localDateKey();
  const cards = reviewCards();
  const byId = new Map(cards.map((card) => [card.id, card]));
  const due = dueCards(cards, today);

  const count = $("#review-count");
  count.hidden = due.length === 0;
  count.textContent = String(due.length);

  session.queue = session.queue.filter((id) => byId.has(id));
  if (!session.queue.length) session.queue = due.map((card) => card.id);

  if (!cards.length) {
    setText("#review-status", "");
    content.innerHTML = '<div class="empty-state"><h3>Az ismétlő pakli még üres</h3><p>A pakli a teljesített leckék önellenőrző kérdéseiből és a kvízben elrontott kérdésekből épül. Teljesíts egy leckét, és másnap itt várnak a kérdései.</p><button class="secondary-button" type="button" data-view-target="tananyag">Tananyag megnyitása</button></div>';
    return;
  }

  if (!session.queue.length) {
    const upcoming = nextUpcoming(cards, today);
    setText("#review-status", `A pakliban ${cards.length} kártya van.`);
    content.innerHTML = `<div class="empty-state"><h3>${session.done ? `Mára kész: ${session.done} kártyát ismételtél át` : "Mára nincs esedékes kártya"}</h3><p>${upcoming ? `A következő ismétlés: ${shortDate(upcoming.date)}, ${upcoming.count} kártya. A tudott kártyák egyre ritkábban jönnek vissza.` : "Minden kártya a helyén van."}</p></div>`;
    return;
  }

  const card = byId.get(session.queue[0]);
  setText("#review-status", `Mára még ${session.queue.length} kártya van hátra. A pakliban összesen ${cards.length}.`);
  const source = card.lesson ? `${card.fromQuiz ? "Kvízkérdés" : "Önellenőrzés"} · ${card.lesson.globalIndex}. lecke: ${card.lesson.title}` : "Kvízkérdés";
  content.innerHTML = `<article class="review-card">
    <p class="review-card__source">${escapeHTML(source)}</p>
    <h2>${escapeHTML(card.front)}</h2>
    ${session.revealed
      ? `<div class="review-card__answer">${formatInline(card.back)}</div>
         <div class="review-actions"><button class="secondary-button" type="button" data-review-grade="again">Nem tudtam <kbd>1</kbd></button><button class="primary-button" type="button" data-review-grade="good">Tudtam <kbd>2</kbd></button>${card.lesson ? `<button class="text-button" type="button" data-open-lesson="${card.lesson.id}">Lecke megnyitása</button>` : ""}</div>`
      : '<div class="review-actions"><button class="primary-button" type="button" data-review-reveal>Válasz mutatása <kbd>szóköz</kbd></button></div>'}
  </article>`;
  if (focus) content.querySelector('[data-review-reveal], [data-review-grade="good"]')?.focus({ preventScroll: true });
}

function reveal() {
  if (!session.queue.length || session.revealed) return;
  session.revealed = true;
  renderReview(true);
}

function grade(known) {
  const id = session.queue[0];
  if (!id || !session.revealed) return;
  const secondLook = session.again.has(id);
  session.queue.shift();
  session.revealed = false;
  // Az elrontott kártya még egyszer visszajön a mai körben, de az ütemezése holnapra szól.
  if (!secondLook) {
    state.reviews[id] = gradeCard(state.reviews[id], known, localDateKey());
    session.done += 1;
    if (!known) { session.again.add(id); session.queue.push(id); }
    recordActivity();
    commit("Ismétlés mentve");
  }
  renderReview(true);
}

export function resetReview() {
  session = { queue: [], revealed: false, done: 0, again: new Set() };
}

export function initReview() {
  onRender(() => renderReview());
  $("#review-content").addEventListener("click", (event) => {
    if (event.target.closest("[data-review-reveal]")) reveal();
    const button = event.target.closest("[data-review-grade]");
    if (button) grade(button.dataset.reviewGrade === "good");
  });
  document.addEventListener("keydown", (event) => {
    if (getCurrentView() !== "gyakorlas" || currentTab("practice") !== "review") return;
    if (event.target.closest("input, textarea, select, dialog") || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === " " && !session.revealed && session.queue.length) { event.preventDefault(); reveal(); }
    else if (event.key === "1" && session.revealed) grade(false);
    else if (event.key === "2" && session.revealed) grade(true);
  });
}
