---
title: "Making TypeScript Actually Useful"
date: 2026-03-30
excerpt: "TypeScript with strict mode off and any scattered through the codebase is just JavaScript with extra steps. Here's how I actually use it to catch real bugs before they ship."
tags:
  - posts
  - code
  - typescript
category: professional
likes: 93
replies: 27
readTime: 5
layout: post-layout.njk
---

TypeScript with strict mode off and `any` scattered through the codebase is just JavaScript with extra steps. The type system only pays off if you actually use it, and using it properly takes more thought than most tutorials suggest.

## Turn strict mode on immediately

Start every project with `"strict": true` in `tsconfig.json`. This enables `strictNullChecks`, `noImplicitAny`, and several others. If you're adding TypeScript to an existing codebase, do this first and fix the errors before writing any new code. They will reveal real bugs — unchecked nulls, missing property access guards, functions that sometimes return `undefined` without the caller knowing.

`any` is a trapdoor. Once you use it, TypeScript stops checking that part of your code entirely. If you find yourself reaching for `any`, the right answer is usually `unknown` (which forces you to actually check the type before using it) or a proper type definition.

## Model your domain in types

The most useful thing TypeScript can do is make illegal states unrepresentable. If a `User` can either be authenticated or anonymous, don't model that as:

```ts
type User = {
  id?: string;
  email?: string;
  isAuthenticated: boolean;
};
```

Model it as a discriminated union:

```ts
type User =
  | { kind: 'authenticated'; id: string; email: string }
  | { kind: 'anonymous' };
```

Now the compiler knows that `id` and `email` only exist on authenticated users, and you can't accidentally access them without checking `kind` first.

## Avoid type assertions

`as SomeType` is telling the compiler to trust you instead of checking. Sometimes that's necessary — when working with JSON from an external source, for example. But it's easy to overuse. Every `as` in your codebase is a place where TypeScript isn't protecting you. Audit them occasionally.

## The utility types are your friends

`Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>` — these let you derive types from existing types instead of duplicating them. If you're defining a type that's clearly related to another type you already have, reach for a utility type first.
