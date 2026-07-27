---
title: "Design Systems Are Hard to Get Right"
date: 2026-05-01
excerpt: "Every team thinks they need a design system. Most of them build one, maintain it for six months, and quietly abandon it. Here's why that keeps happening."
tags:
  - posts
  - design
  - tools
category: professional
likes: 72
replies: 19
readTime: 5
layout: post-layout.njk
images:
  - https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop
---

Every team thinks they need a design system. Most of them build one, maintain it for six months, and quietly abandon it. The components get out of date. Nobody has time to update the documentation. Engineers start copying styles directly. Designers start designing around the system instead of with it. And eventually the whole thing becomes a reference document that nobody trusts.

## The maintenance problem is the real problem

Building a component library is the easy part. The hard part is treating it like a product — with an owner, a roadmap, and a process for accepting contributions. Most teams skip that part. They build the components and assume the system will maintain itself.

It won't. A design system is software. Software rots without attention.

## Token-first, component-second

The one thing that actually helps: investing heavily in the token layer before you build any components. If your colors, spacing, and typography are all named variables that live in one place, components become almost incidental. You can change a shade of grey globally in a single edit. Components that use the token pick up the change automatically.

The teams I've seen get this right spend more time debating token names than component APIs. That sounds tedious but it pays off.

## When a design system isn't the answer

If you have fewer than three designers and fewer than ten engineers, you probably don't need a design system. You need a shared Figma file and a CSS variables file. A full component library is overhead you can't afford to maintain at that scale. Ship the product first. Extract patterns later, when you actually know what they are.
