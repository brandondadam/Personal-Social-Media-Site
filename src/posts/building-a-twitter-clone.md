---
title: "What I Learned Building a Twitter Clone in a Day"
date: 2026-04-20
excerpt: "I built a pixel-accurate Twitter feed clone in a single afternoon — no frameworks, just HTML, CSS, and vanilla JS. Here's what surprised me about how Twitter's UI is actually constructed."
tags:
  - posts
  - code
  - css
category: professional
likes: 134
replies: 28
views: 6200
readTime: 5
layout: post-layout.njk
images:
  - https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&auto=format&fit=crop
  - https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop
  - https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop
---

I built a pixel-accurate Twitter feed clone in a single afternoon — no frameworks, just HTML, CSS, and vanilla JS. Here's what surprised me about how Twitter's UI is actually constructed.

## The layout is simpler than you'd think

Twitter's three-column layout is just `display: flex` on a max-width container. The left sidebar is `position: sticky` with `height: 100vh`. No CSS Grid, no complex positioning. The apparent complexity comes from the density of the components, not the layout system.

```css
.layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
}

.sidebar {
  width: 275px;
  position: sticky;
  top: 0;
  height: 100vh;
}
```

## The tweet card is all flexbox

![The finished clone rendered in Chrome — three-column layout, dark theme, sticky header](https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80&auto=format&fit=crop)

Each tweet is a horizontal flex container — avatar on the left, everything else on the right. The avatar column is `flex-shrink: 0` so it never compresses. The body is `flex: 1; min-width: 0` (the `min-width: 0` is the trick that makes text truncation work in flex children).

## The glass header took me three tries

The sticky header with the blur effect looks like a single CSS property but it's actually two:

```css
background: rgba(0, 0, 0, 0.85);
backdrop-filter: blur(12px);
```

The `rgba` makes the background semi-transparent so content shows through. The `backdrop-filter` blurs whatever's behind it. Drop either one and it looks wrong.

## Interactive state without a framework

I kept all the tweet state (liked, retweeted, bookmarked counts) in a plain JS array and re-rendered the feed on every interaction. Not optimal for a real app but perfectly fine for a prototype. The whole interactive layer is maybe 60 lines.

## What I'd do differently

For a real project I'd reach for Svelte or Solid for the reactive bits — not because vanilla JS can't do it, but because managing re-renders by hand gets tedious fast. But for a one-day build? Vanilla all the way.

The finished clone is the foundation for this blog.
