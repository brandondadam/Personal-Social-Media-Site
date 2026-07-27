const postState = {};

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function initPostState() {
  document.querySelectorAll('.post-card[data-id]').forEach(el => {
    const id = el.dataset.id;
    postState[id] = {
      likes: parseInt(el.dataset.likes || 0),
      replies: parseInt(el.dataset.replies || 0),
      liked: false,
    };
    updateCardDisplay(el, id);
  });
}

function updateCardDisplay(card, id) {
  const state = postState[id];
  if (!state) return;

  const likesEl = card.querySelector('[data-field="likes"]');
  const repliesEl = card.querySelector('[data-field="replies"]');
  const likeAction = card.querySelector('.liked-action');

  if (likesEl) likesEl.textContent = formatNumber(state.likes);
  if (repliesEl) repliesEl.textContent = formatNumber(state.replies);
  if (likeAction) likeAction.classList.toggle('liked', state.liked);
}

function handleAction(e, id, type) {
  const state = postState[id];
  if (!state) return;

  if (type === 'like') {
    state.liked = !state.liked;
    state.likes += state.liked ? 1 : -1;
  }

  const card = document.querySelector(`.post-card[data-id="${id}"]`);
  if (card) updateCardDisplay(card, id);
}

function initTabs() {
  const tabBar = document.querySelector('.tab-bar');
  if (!tabBar) return;
  const tabs = tabBar.querySelectorAll('.tab');
  if (!tabs.length) return;

  // Create the sliding indicator
  const indicator = document.createElement('div');
  indicator.className = 'tab-indicator';
  tabBar.appendChild(indicator);

  function moveIndicatorTo(tab, animated) {
    if (!animated) indicator.style.transition = 'none';
    const barRect = tabBar.getBoundingClientRect();
    const inner = tab.querySelector('.tab-inner');
    const innerRect = inner.getBoundingClientRect();
    indicator.style.left = (innerRect.left - barRect.left) + 'px';
    indicator.style.width = innerRect.width + 'px';
    if (!animated) requestAnimationFrame(() => { indicator.style.transition = ''; });
  }

  // Position on the active tab immediately (no animation)
  moveIndicatorTo(tabBar.querySelector('.tab.active') || tabs[0], false);

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => moveIndicatorTo(tab, true));
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const selected = tab.dataset.tab;
      document.querySelectorAll('.post-card').forEach(card => {
        const cat = card.dataset.category || 'all';
        card.style.display = (selected === 'all' || cat === selected) ? '' : 'none';
      });

    });
  });

  // Snap back to the active tab when cursor leaves the tab bar
  tabBar.addEventListener('mouseleave', () => {
    moveIndicatorTo(tabBar.querySelector('.tab.active') || tabs[0], true);
  });
}

function initNoteworthyFilter() {
  const filterWrap = document.querySelector('.filter-wrap');
  if (!filterWrap) return;

  const container = document.querySelector('.noteworthy-container');
  const items = container ? Array.from(container.querySelectorAll('.noteworthy-item')) : [];
  if (!items.length) return;

  // Collect unique tags with counts from existing items
  const tagCounts = {};
  items.forEach(item => {
    const tagEl = item.querySelector('.tag span');
    if (tagEl) {
      const tag = tagEl.textContent.trim();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  });
  const tags = Object.keys(tagCounts).sort();
  if (!tags.length) return;

  const btn = filterWrap.querySelector('.filter-btn');
  const countBadge = filterWrap.querySelector('.filter-count');
  const dropdown = filterWrap.querySelector('.filter-dropdown');

  // Build dropdown
  const clearRow = document.createElement('div');
  clearRow.className = 'filter-clear-row';
  clearRow.innerHTML = '<button class="filter-clear-btn">Clear All</button>';
  clearRow.hidden = true;
  dropdown.appendChild(clearRow);

  const list = document.createElement('ul');
  list.className = 'filter-list';
  tags.forEach(tag => {
    const id = `filter-${tag.toLowerCase().replace(/\s+/g, '-')}`;
    const li = document.createElement('li');
    li.innerHTML = `<label class="filter-option" for="${id}">
      <input class="filter-checkbox" type="checkbox" id="${id}" value="${tag}">
      <img class="filter-checkbox-icon" src="/assets/icons/Check-Unchecked.svg" alt="" width="20" height="20" aria-hidden="true">
      <span class="filter-option-name">${tag}</span>
      <span class="filter-option-count">${tagCounts[tag]}</span>
    </label>`;
    list.appendChild(li);
  });
  dropdown.appendChild(list);

  const selected = new Set();

  function applyFilter() {
    const active = selected.size > 0;
    items.forEach(item => {
      const tag = item.querySelector('.tag span')?.textContent.trim() || '';
      item.style.display = (active && !selected.has(tag)) ? 'none' : '';
    });

    countBadge.querySelector('span').textContent = String(selected.size).padStart(2, '0');
    countBadge.hidden = !active;
    clearRow.hidden = !active;

    const anyVisible = items.some(i => i.style.display !== 'none');
    let emptyEl = container.querySelector('.filter-empty');
    if (!anyVisible) {
      if (!emptyEl) {
        emptyEl = document.createElement('p');
        emptyEl.className = 'filter-empty';
        emptyEl.innerHTML = 'No items match your filters. <button class="filter-empty-clear">Clear filters</button>';
        emptyEl.querySelector('.filter-empty-clear').addEventListener('click', clearAll);
        container.appendChild(emptyEl);
      }
    } else {
      emptyEl?.remove();
    }
  }

  function clearAll() {
    selected.clear();
    list.querySelectorAll('.filter-checkbox').forEach(cb => {
      cb.checked = false;
      cb.nextElementSibling.src = '/assets/icons/Check-Unchecked.svg';
    });
    applyFilter();
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'filter-backdrop';
  document.body.appendChild(backdrop);

  function openDropdown() {
    dropdown.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('is-visible');
  }

  function closeDropdown() {
    dropdown.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('is-visible');
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.hidden ? openDropdown() : closeDropdown();
  });

  list.addEventListener('change', e => {
    if (e.target.classList.contains('filter-checkbox')) {
      e.target.checked ? selected.add(e.target.value) : selected.delete(e.target.value);
      e.target.nextElementSibling.src = e.target.checked
        ? '/assets/icons/Check-Checked.svg'
        : '/assets/icons/Check-Unchecked.svg';
      applyFilter();
    }
  });

  clearRow.querySelector('.filter-clear-btn').addEventListener('click', clearAll);

  backdrop.addEventListener('click', closeDropdown);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !dropdown.hidden) {
      closeDropdown();
      btn.focus();
    }
  });
}

function initLightbox() {
  const overlay = document.getElementById('img-overlay');
  if (!overlay) return;
  const overlayImg = overlay.querySelector('.img-overlay-img');
  const closeBtn = overlay.querySelector('.img-overlay-close');

  function open(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.hidden = true;
    overlayImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => open(el.src || el.dataset.src, el.alt));
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  overlayImg.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
}

function initSearch() {
  const trigger = document.getElementById('search-trigger');
  const overlay = document.getElementById('search-overlay');
  if (!trigger || !overlay) return;

  const overlayInput = overlay.querySelector('.search-overlay-input');
  const closeBtn = overlay.querySelector('.search-overlay-close-btn');
  const resultsEl = overlay.querySelector('.search-overlay-results');

  let index = null;
  let activeIndex = -1;

  async function loadIndex() {
    if (index !== null) return;
    try {
      const res = await fetch('/search.json');
      index = await res.json();
    } catch {
      index = [];
    }
  }

  function openOverlay() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlayInput.value = '';
    resultsEl.innerHTML = '';
    activeIndex = -1;
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    overlayInput.focus();
    loadIndex();
  }

  function closeOverlay() {
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    overlayInput.value = '';
    resultsEl.innerHTML = '';
    activeIndex = -1;
    setTimeout(() => { overlay.hidden = true; }, 250);
  }

  function scoreItem(item, q) {
    const fields = item.type === 'post'
      ? [item.title, item.excerpt, item.category]
      : [item.name, item.domain, item.tag];
    let s = 0;
    for (const f of fields) {
      if (!f) continue;
      const fl = f.toLowerCase();
      if (fl === q) s += 100;
      else if (fl.startsWith(q)) s += 40;
      else if (fl.includes(q)) s += 10;
    }
    const primary = (item.title || item.name || '').toLowerCase();
    if (primary.startsWith(q)) s += 20;
    return s;
  }

  function highlight(text, q) {
    if (!text) return '';
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
  }

  function truncate(text, max) {
    if (!text || text.length <= max) return text || '';
    const cut = text.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(' ') || max) + '…';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      resultsEl.innerHTML = '';
      activeIndex = -1;
      return;
    }

    const scored = (index || [])
      .map(item => ({ item, s: scoreItem(item, q) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(x => x.item);

    if (!scored.length) {
      resultsEl.innerHTML = `<div class="search-overlay-empty">No results for "${query}"</div>`;
      activeIndex = -1;
      return;
    }

    resultsEl.innerHTML = scored.map((item, i) => {
      if (item.type === 'post') {
        return `<a class="search-overlay-result" href="${item.url}" data-index="${i}">
          <div class="search-overlay-result-header">
            <span class="search-overlay-result-title">${highlight(item.title, q)}</span>
            <div class="tag tag--sm"><span>${item.category || 'post'}</span></div>
          </div>
          <span class="search-overlay-result-meta">${highlight(truncate(item.excerpt, 100), q)}</span>
        </a>`;
      }
      return `<a class="search-overlay-result" href="${item.href}" target="_blank" rel="noopener" data-index="${i}">
        <div class="search-overlay-result-header">
          <span class="search-overlay-result-title">${highlight(item.name, q)}</span>
          <div class="tag tag--sm"><span>${item.tag}</span></div>
        </div>
        <span class="search-overlay-result-meta">${highlight(item.domain, q)}</span>
      </a>`;
    }).join('');

    activeIndex = -1;
  }

  function setActive(newIndex) {
    const items = resultsEl.querySelectorAll('.search-overlay-result');
    items.forEach((el, i) => el.classList.toggle('is-active', i === newIndex));
    activeIndex = newIndex;
  }

  // Sidebar trigger
  trigger.addEventListener('click', openOverlay);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOverlay(); }
  });

  // Overlay input
  overlayInput.addEventListener('input', () => renderResults(overlayInput.value));

  overlayInput.addEventListener('keydown', e => {
    const items = resultsEl.querySelectorAll('.search-overlay-result');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      items[activeIndex].click();
    } else if (e.key === 'Escape') {
      closeOverlay();
    }
  });

  closeBtn.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) closeOverlay();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initPostState();
  initTabs();
  initNoteworthyFilter();
  initSearch();
  initLightbox();
});
