---
title: "Write More Docs, Thank Yourself Later"
date: 2026-03-18
excerpt: "Documentation has a bad reputation because most documentation is bad. The kind that actually helps takes twenty minutes to write and saves hours every time someone (including you) reads it."
tags:
  - posts
  - productivity
category: professional
likes: 41
replies: 9
readTime: 3
layout: post-layout.njk
---

Documentation has a bad reputation because most documentation is bad. Outdated READMEs, API references generated from half-written docstrings, architectural decision records that trail off mid-sentence. The kind that actually helps is rarer, and it takes more thought to write — but far less time than people assume.

## The only docs that matter are the ones people read

A 40-page onboarding document is less useful than a one-page list of "the five things you need to understand before touching this codebase." Write for the reader's context, not your own. They're confused. They're looking for something specific. They'll close the tab if they don't find it in thirty seconds.

Short, specific documentation that's kept current beats comprehensive documentation that's six months stale.

## Document the why, not the what

The code documents what. The comments and docs should document why — why this approach instead of the obvious one, what constraint the code is working around, what will break if someone changes this in the way that seems sensible.

If you had to make a non-obvious decision, write a one-paragraph ADR (Architecture Decision Record) in the repo. The format doesn't matter. Just: what was decided, why that option, what the tradeoffs were. Future you will be grateful.

## Write it when it's fresh

The best time to write documentation is immediately after you figured something out — while the confusion is still fresh and you remember exactly what was unclear. Deferring it until "later" means it never gets written, or gets written in a way that assumes too much prior knowledge.

Thirty minutes of documentation written in the moment the PR is open is worth more than two hours written retrospectively six months later.
