---
title: "How I Approach API Design"
date: 2026-04-10
excerpt: "APIs are interfaces. The same instincts that make UI good — clarity, predictability, good defaults — make APIs good. Most bad APIs I've worked with forgot that real people have to read the responses."
tags:
  - posts
  - code
  - backend
category: professional
likes: 58
replies: 14
readTime: 4
layout: post-layout.njk
images:
  - https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop
---

APIs are interfaces. The same instincts that make UI good — clarity, predictability, good defaults — make APIs good. Most bad APIs I've worked with forgot that real people have to read the responses.

## Name things for the consumer, not the database

If your database column is called `usr_created_at_utc`, your API field should be called `createdAt`. The consumer doesn't care about your schema. They care about understanding what the field means in three seconds without reading documentation.

Consistency matters more than cleverness here. Pick a naming convention and apply it everywhere. camelCase or snake_case, pick one. Plural collection names or singular, pick one. Timestamp format (ISO 8601, always), pick one. The convention is almost irrelevant. The inconsistency is the problem.

## Errors deserve as much thought as success responses

Most of the API design effort goes into what happens when things work. The error cases are an afterthought — a generic 500 with a message that says "Internal server error." That's not useful to anyone.

A good error response tells you: what went wrong, which field caused it if applicable, and what to do about it. That's three fields. It's not hard.

```json
{
  "error": "validation_failed",
  "field": "email",
  "message": "Email address is already in use."
}
```

## Pagination is a contract

Once you ship a pagination approach, you're stuck with it. Offset-based pagination (`?page=2&limit=20`) is easy to implement but breaks when items are added or deleted mid-browse. Cursor-based pagination is harder to implement but stable. Think about which one you need before you build the first endpoint, not when you're trying to fix a bug in production.

## Version from day one

Even if you're the only consumer. Even if it's internal. Add `/v1/` to every route before you ship anything. The cost is essentially zero upfront. The cost of retrofitting versioning onto an API with existing consumers is not zero.
