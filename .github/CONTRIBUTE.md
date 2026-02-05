# CONTRIBUTING

Thank you for your interest in contributing!

To keep the project maintainable and ensure a high-quality codebase, we ask all contributors to follow the guidelines
outlined below.

---

## 🧩 Issues First – Always

Before submitting any Pull Request, you **must first open an Issue** that clearly explains the problem, enhancement, or
feature you're proposing.

> Pull Requests without a related, pre-existing Issue will be **closed without review**.

This ensures that your proposal is aligned with the project's goals before any code is written.

---

## 🧱 Development Environment via Devcontainer

This project provides a ready-to-use [**Devcontainer**](https://code.visualstudio.com/docs/devcontainers/overview)
configuration for consistent and easy local development.

### ✅ Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- (Optional but recommended) Docker Desktop or Podman

### 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/skriptfabrik/n8n-nodes.git
   cd n8n-nodes
   ```

2. **Open the project in VS Code:**

   ```bash
   code .
   ```

3. **Reopen in Container:**
   If prompted, click “Reopen in Container”.
   If not prompted, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and select:

   ```text
   Dev Containers: Reopen in Container
   ```

4. The container will build automatically and install all required dependencies.
5. You can now develop in a fully configured environment.

---

## 🧪 Start Development Server

This project uses [Turborepo](https://turborepo.com/) as the monorepo toolchain and [pnpm](https://pnpm.io) as the
package manager.

### 🧰 Common Tasks

All commands are executed via `pnpm` (not `npm` or `yarn`).

### ✅ Install dependencies

```bash
pnpm install
```

### 🚀 Start development server

```bash
pnpm run n8n:start
```

## Run initial owner setup

```bash
pnpm run n8n:owner:setup
```

You may now open [n8n](http://localhost:5678/) in your favorite Browser and sign in as owner with email `owner@n8n.local`
and password `n8nOwner`.

### Compile nodes in watch mode

```bash
pnpm run dev
```

This will compile all nodes and automatically reload or restart the application when changes occur in the source code files.

### 🔍 Run linters

```bash
pnpm run lint
```

Or for a specific project:

```bash
pnpm run lint --filter=<package-name>
```

### 🚀 Build a project (if applicable)

```bash
pnpm run build --filter=<package-name>
```

---

## 📦 Fork & Branch Workflow

1. Fork this repository.
2. Create a feature branch with a meaningful name (e.g. `fix/timeout-bug` or `feat/custom-fields-support`).
3. Implement your changes.
4. Ensure all tests pass (if applicable).

---

## ✅ Commit Message Guidelines

This project enforces commit message formatting using [`commitlint`](https://commitlint.js.org/).  
All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### 💡 Format

```text
<type>(<optional scope>): <short description> (#<issue-id>)
```

### 📌 Examples

fix(clockify-enhanced): handle missing field error in Clockify node (#42)
feat: add OAuth2 support for custom APIs (#128)
refactor: simplify error handling in node loader (#77)

> 🔗 **Note:** Every commit **must end with an Issue reference** in the format `(#<number>)` that links to the
> corresponding GitHub Issue.

### Allowed `type` values

- `feat`: Introduces a new feature
- `fix`: Fixes a bug
- `refactor`: Code improvements without functional changes
- `docs`: Documentation-only changes
- `test`: Adding or updating tests
- `chore`: Tooling, maintenance, CI-related changes
- `style`: Formatting, linting, whitespace etc.

---

## 🔁 Pull Request Guidelines

Once your changes are ready:

1. Open a Pull Request targeting the `main` branch.
2. Reference the corresponding Issue in the PR description (e.g. `Closes #123`).
3. Ensure the PR has a clear title and explains what the change does and why.
4. PRs without a matching Issue or clear context may be closed without merging.

---

## 📣 Communication & Feedback

We review contributions as time allows.  
Be prepared to receive and incorporate constructive feedback — the goal is clean and maintainable code for everyone.

---
