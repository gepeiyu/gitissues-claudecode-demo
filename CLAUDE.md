# Claude Code Governance Rules

## Core Principles

- All work must start from a GitHub Issue
- Never code before an approved implementation plan
- Never develop directly on main
- Never merge Pull Requests automatically
- Keep changes minimal and focused
- Human approval is required for scope changes and dangerous operations

---

# 1. Issue Rules

All development must originate from a GitHub Issue.

Every Issue should include:

- Goal
- Requirements
- Acceptance Criteria
- Non-Goals
- Technical Notes (if needed)

Example Non-Goals:

- Do not refactor auth module
- Do not introduce database
- Do not change API response format

If requirements are unclear:
- ask questions first
- do not guess

---

# 2. Planning Rules

Before implementation:

1. Read the entire Issue
2. Analyze the requirement
3. Create an implementation plan
4. Post the plan into Issue comments
5. Wait for human confirmation
6. Start development only after confirmation

Never start coding immediately.

Implementation Plan must include:

- Files to create
- Files to modify
- Test plan
- Risks
- Out-of-scope items
- Expected modified files

If additional files become necessary:
- explain why
- request approval first

---

# 2.1 Status Update Rules

**Before starting implementation:**
1. Add a "Status Update: Starting implementation" comment to the Issue, describing upcoming work
2. **Only then start coding**

**After implementation is complete:**
1. Add a "Status Update: Completed, waiting for confirmation" comment to the Issue, including:
   - List of files created/modified
   - Test results
   - Acceptance criteria checklist
2. Wait for user to confirm implementation fully meets requirements
3. **Only create a Pull Request when the user explicitly requests it**

**Forbidden:**
- Starting coding without updating start status in the Issue
- Automatically creating a PR without user confirmation

---

# 3. Scope Control Rules

Do not expand scope without approval.

If additional refactoring or redesign appears necessary:

1. Stop
2. Explain the reason
3. Describe the impact
4. Request approval
5. Continue only after confirmation

Prefer the simplest implementation that satisfies the Issue requirements.

Do not introduce:

- unnecessary abstractions
- generic frameworks
- premature extensibility
- architecture redesigns

---

# 4. Git Rules

Never develop directly on `main`.

Always create a feature branch:

```bash
git checkout -b feature/issue-<id>-<short-name>
```

Examples:

```bash
feature/issue-12-users-api
feature/issue-18-login-fix
```

Commits should be:

- Small
- Focused
- Logically grouped

Use conventional commits:

```bash
feat(users): add name filtering
fix(auth): handle expired token
```

---

# 5. Dangerous Command Rules

Never run dangerous commands without explicit approval.

Forbidden without confirmation:

```bash
git push --force
git reset --hard
git clean -fd
rm -rf
git rebase
```

If such operations are needed:
- explain why
- explain risks
- wait for approval

---

# 6. Development Rules

Preferred workflow:

1. Write tests based on acceptance criteria
2. Run tests — confirm they fail
3. Report test cases to human and wait for confirmation
4. Implement feature
5. Run tests — confirm they pass
6. Self-review changes
7. Create PR

During development:

- keep changes minimal
- avoid unrelated modifications
- avoid hidden behavior changes
- avoid silent dependency upgrades

Never modify unrelated files.

Never delete files unless explicitly requested.

**TDD Integrity Rules:**

Never modify test expectations to make tests pass.

Never delete or comment out failing test cases.

Never use `skip` or `only` to bypass failing tests.

Never lower acceptance criteria to match a broken implementation.

Tests must cover:

- normal path
- boundary inputs (empty, maximum, special characters)
- invalid inputs (missing fields, wrong types)

If a test cannot be made to pass without violating the above rules:
- stop
- report the conflict
- wait for human decision

---

# 7. Failure Handling Rules

If tests or implementation fail repeatedly:

After 3 failed attempts:

1. Stop implementation
2. Summarize current status
3. Explain root cause
4. List attempted fixes
5. Wait for human decision

Do not loop endlessly.

---

# 8. Pull Request Rules

All changes must go through Pull Request review.

Never merge automatically.

After PR creation:
- stop
- wait for human review

Prefer small Pull Requests.

If implementation becomes too large:
- split into phases
- or propose multiple PRs

PR description should include:

- summary
- related issue
- approved plan link
- testing results
- risks
- known limitations

---

# 9. Review Rules

Review must verify:

- implementation matches approved plan
- acceptance criteria satisfied
- no extra scope added
- no unrelated files modified
- tests are sufficient
- risks are acceptable

If implementation diverges from plan:
- explain why
- request approval

---

# 10. Decision Record Rules

Important technical decisions should be recorded in Issue comments.

Use this structure:

```text
Decision:
Reason:
Trade-offs:
```

Examples:

- choosing in-memory storage
- avoiding ORM
- postponing caching
- simplifying architecture

---

# 11. Completion Rules

A task is complete only when:

- tests pass
- acceptance criteria verified
- implementation matches approved plan
- PR created
- review is ready

Implementation alone does not mean completion.

---

# 12. Human Authority Rules

Human owns:

- scope decisions
- architecture decisions
- merge decisions
- production decisions
- priority decisions

Claude owns:

- implementation
- tests
- local refactoring within approved scope
- code suggestions

If authority is unclear:
- ask first

---

# 13. Communication Rules

Be concise and direct.

Avoid unnecessary explanations.

Report:
- risks
- blockers
- assumptions
- trade-offs

If uncertain:
- ask questions before implementation
