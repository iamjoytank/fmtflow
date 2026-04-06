---
name: release
description: fmtflow release workflow — version bumping, branch/worktree setup, commit sequence, and merge. Use when starting any release or feature branch.
---

# fmtflow Release Workflow

## Version Bump Rules

| Change type | Example | Version bump |
|-------------|---------|-------------|
| Bug fix (no API change) | Fix wrong output | patch: `1.1.0 → 1.1.1` |
| New feature (backward-compatible) | Add new method | minor: `1.1.0 → 1.2.0` |
| Breaking change | Remove/rename method | major: `1.1.0 → 2.0.0` |

Current version is always in `package.json` → `"version"` field.

## Branch Naming

- New feature: `feat/vX.Y.Z` (e.g. `feat/v1.2.0`)
- Bug fix: `fix/vX.Y.Z` (e.g. `fix/v1.1.1`)
- Breaking: `breaking/vX.Y.Z` (e.g. `breaking/v2.0.0`)

## Worktree Setup

Always work in an isolated git worktree — never directly on `main`.

```bash
# From E:/mywork/mine/fmtflow
git worktree add ../fmtflow-vX.Y.Z -b feat/vX.Y.Z
# Work in E:/mywork/mine/fmtflow-vX.Y.Z
```

Worktree directory naming convention: `fmtflow-vX.Y.Z` (sibling of main repo dir).

## Commit Sequence

Two commits per release — no co-author lines:

1. **Implementation commit**
   ```
   feat: <description of what was added>
   ```
   Includes: source changes + tests

2. **Version bump commit**
   ```
   chore: bump version to X.Y.Z
   ```
   Includes: `package.json` only

Never combine implementation and version bump in one commit.

## Verification Before Merge

Run all three in the worktree:

```bash
bun run test    # all tests must pass
bun run build   # dist must build cleanly
bun run lint    # zero lint errors
```

## Merge to Main

```bash
# From the main repo dir (E:/mywork/mine/fmtflow)
git merge feat/vX.Y.Z --no-ff
git worktree remove ../fmtflow-vX.Y.Z
git branch -d feat/vX.Y.Z
```

## Project Preferences

- No `Co-Authored-By` lines in any commit messages
- Default locale is `en-IN` (server-side fallback in `src/builder.ts`)
- Tests live in `tests/formatter.test.ts` — add a new `describe` block per version
- Cache (`src/cache.ts`) needs no changes — `JSON.stringify(options)` covers new fields automatically
