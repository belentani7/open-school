# Contributing to Open School

## Set up

Use Node 20+ and the single checked-in lockfile (`pnpm-lock.yaml`):

```bash
corepack pnpm install --frozen-lockfile
```

The optional Python backend requires Python 3.10+. Install test tools with
`python -m pip install -e 'backend[dev]'`.

## Development checks

```bash
corepack pnpm check
corepack pnpm test
corepack pnpm build
corepack pnpm audit --audit-level=high
(cd backend && python -m pytest -q)
```

For local backend work, run `python -m app.main` from `backend/`. The tutor
uses the Ollama service configured by the operator; the browser does not send
questions to it unless the user enables the model option.

## Changes and pull requests

- Create a focused branch and use a conventional commit message.
- Add regression tests for behavior changes.
- Keep the privacy-first, offline-capable product behavior intact.
- Do not add credentials, student data, or generated build output to commits.
- Update the relevant documentation when routes or setup instructions change.
