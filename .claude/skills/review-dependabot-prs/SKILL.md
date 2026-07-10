---
name: review-dependabot-prs
description: Use when the user asks to review, process, or merge open Dependabot PRs (e.g. "review the dependabot PRs", "merge the open dependency bumps"). Walks each PR through CI check, review, rebase-if-stale, and squash-merge.
---

# Review Dependabot PRs

Process every open Dependabot PR in the repo: verify CI, review the bump, rebase onto the latest `main` if stale, and squash-merge. Handle them one at a time — each merge can stale the remaining PRs.

## Steps

1. **List open Dependabot PRs.** Search `is:pr is:open author:app/dependabot` and order them oldest-first (lowest number first). Process them sequentially — merging one stales the rest.
2. **For each PR, in order:**
   1. **Check CI.** Look up the PR's check runs (e.g. `gh pr checks`). Branch protection requires `Tests` (lint + ember test), `Floating Dependencies`, `ember-lts-5.12`, and `ember-6` — those must succeed. The channel scenarios (`ember-release`, `ember-beta`, `ember-canary`) and `embroider-safe` also run; investigate their failures but they gate differently:
      - `ember-release` / `ember-beta` / `ember-canary` track upstream Ember channels — as of mid-2026 all three fail on every PR because the channels serve Ember 7, which this classic v1 addon can't build against yet. That's a known project-level gap, not a PR defect: confirm the failure is the same pre-existing one (fails identically on `main` or on unrelated PRs), note it in the summary, and don't block the merge on it. Once Ember 7 support lands, treat these as regular signals again.
      - For any other failed check, read the failed job's log and diagnose why. Check whether the same check also fails on `main` (latest push run); if it does, it doesn't block this PR, but note it in the summary.
      - `Floating Dependencies` installs with `--no-lockfile`, so it can break from an unrelated latest-release of some other dependency. Same rule: compare against `main`.
      - If the cause is something reasonably fixable on our end (e.g. our config relying on an export shape or API the new version changed), commit the fix to the PR branch itself so CI verifies it against the new version, and wait for the re-run. If it's a genuine upstream regression in the bumped package, skip this PR, continue with the remaining ones, and surface the failure — with a link to the failed job — in the final summary.
   2. **Review the bump.** Read the diff and the changelog/release-notes embedded in the PR body. Grouped PRs (the `babel`, `eslint`, `qunit`, and `stylelint` groups) bump several packages at once — review each package's notes. Focus on:
      - Whether it's patch / minor / major.
      - Any "breaking" notes — and whether they apply to *this* package. It's an Ember addon shipping browser-facing component code built through ember-cli/broccoli, so browser- and bundler-facing changes in runtime deps (`ember-cli-htmlbars`, `ember-template-imports`, `ember-cli-babel`, `@babel/core`, etc.) and the `@primer/octicons` / `ember-source` peers are in scope — don't wave them off. Dev-only tooling (eslint, stylelint, prettier, qunit, webpack) only needs CI to stay green.
      - A runtime dependency dropping support for a Node line still allowed by `engines` (`>= 20.11`) — CI runs a single Node version, so it won't catch that.
      - A dependency dropping support for an Ember version still covered by `peerDependencies` (`^4.0.0 || >= 5`) or by the ember-try matrix — the pinned scenarios only test 5.12 LTS and latest 6.x.
      - Lockfile churn beyond the bump itself is usually cosmetic from a pnpm regeneration — note it but don't block on it.
      - For `github-actions` ecosystem PRs, review the workflow diff for changed action inputs/defaults instead of package notes.
   3. **If the PR bumps `ember-cli`: apply blueprint updates.** An ember-cli version bump isn't just a package bump — the project blueprint may have changed. Have Dependabot rebase the PR onto current `main` *first*, then pull the branch locally and run `npx ember-cli-update --to <version>` (it needs a clean working tree — stash untracked files if necessary). Triage the staged diff rather than taking it wholesale: keep the `tests/dummy/config/ember-cli-update.json` version marker and anything ember-cli itself needs; drop scaffolding for packages this addon doesn't use (e.g. the 7.x blueprint's WarpDrive/ember-data files), changes that assume an Ember version we can't build against yet, consumer-facing `engines` raises, and dependency floor raises that Dependabot manages per-package. Commit the result to the PR branch — CI then verifies the bump together with the blueprint changes. Because this pushes manual commits, don't post `@dependabot rebase` on this PR afterward (see Notes).
   4. **Confirm up-to-date with `main`.** Compare the commit the PR is based on to the current tip of `main`. If they differ, the branch is stale — post a `@dependabot rebase` comment and wait. Dependabot also auto-rebases some PRs on its own when their base falls behind; if you see "Dependabot is rebasing this PR" in the body, you don't need to comment.
   5. **Wait for the rebase.** Poll until the head SHA changes, then wait for the new CI run to complete (all checks green, subject to the `main`-also-fails exception above). Don't merge until CI is green on the rebased commit.
   6. **Approve and squash-merge.** Approve with a one-paragraph review summarizing the bump and why the breaking-change notes (if any) don't apply. Squash-merge (e.g. `gh pr merge --squash`) — the repo's recent history is squash-merged.
3. **After all PRs are processed,** report which merged and which (if any) need follow-up.

## Notes

- Always squash-merge — matches the recent repo history (`Bump foo from x to y (#NNNN)`).
- Don't run `pnpm install` / `pnpm test` locally as part of the review — CI already does this on the rebased commit, and that's what gates the merge.
- If a bump fails CI, diagnose before giving up: failures caused by our own config lagging the new version are fair game to fix on the PR branch. Never try to patch the upstream package itself — if the regression is upstream, skip the PR and report it.
- Don't post `@dependabot rebase` on a PR after pushing manual commits to its branch — the rebase would discard them.
- If two PRs touch the same lockfile section and the second one needs a rebase, Dependabot handles it — never resolve lockfile conflicts by hand.
- **Blocked majors:** when a major can't be adopted because the ecosystem hasn't caught up (e.g. Babel 8 while `ember-cli-babel` peer-requires `@babel/core ^7`, ESLint 10 while the parser chain is stuck on Babel 8, or a tool dropping a Node line the repo still runs), don't fix-and-force it — post `@dependabot ignore <dependency> major version` with a one-paragraph explanation of the blocker, so it's clear when to `unignore`.
- **Grouped PRs and ignores:** ignoring some members of a group registers the ignore conditions but leaves the PR's branch stale (still containing the ignored bumps). Follow up with `@dependabot recreate` to regenerate the PR honoring the ignores, then process what remains normally.
- Merging requires one approving review and the required checks (`Tests`, `Floating Dependencies`, `ember-lts-5.12`, `ember-6`) green on the PR's head SHA — which is why each PR needs a fresh rebase+CI cycle before merge even without conflicts.
