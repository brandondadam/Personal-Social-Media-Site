---
title: "CSS That Always Surprises Me"
date: 2026-04-28
excerpt: "A running list of CSS behaviour I have to look up every single time, no matter how many times I've used it. Some of this is genuinely unintuitive. Some of it is just me."
tags:
  - posts
  - css
  - code
category: professional
likes: 114
replies: 34
readTime: 4
layout: post-layout.njk
---

A running list of CSS behaviour I have to look up every single time, no matter how many times I've used it.

## Stacking contexts

I know what a stacking context is. I know `position: relative` with a `z-index` creates one. What I always forget is that `transform`, `opacity < 1`, `filter`, and `will-change` also create them — silently, with no obvious indication in the code. Every time I spend twenty minutes debugging a z-index issue, it's one of these.

## `min-width: 0` on flex children

Flex children have a default `min-width` of `auto`, which means they refuse to shrink below their content size. Text that should be truncating with `overflow: hidden; text-overflow: ellipsis` just overflows instead. The fix — `min-width: 0` on the flex child — is one of those things that makes no sense until you understand why, and then seems obvious forever after. Except I still forget it.

## `gap` in flex vs grid

`gap` in grid layout applies between every row and every column. `gap` in flex layout only applies between items in the direction of the main axis. Setting `gap` on a flex container does not add gaps on the outer edges. I know this. I still write `gap` expecting padding behaviour at least once per project.

## `aspect-ratio` and percentage heights

If you give an element `aspect-ratio: 16/9`, it will ignore that entirely if the parent doesn't have a defined height and you're relying on percentage height on the child. The aspect-ratio only works reliably when width is constrained. This one has cost me at least three hours total across different projects.

## The `currentColor` keyword

Not surprising — just underused. `currentColor` resolves to whatever the element's `color` property is, and it works in any CSS property that accepts a color: `border-color`, `box-shadow`, `fill`, `background`. Setting `color` on a component and then using `currentColor` for borders and icons makes theming genuinely simple. I should use it more.
