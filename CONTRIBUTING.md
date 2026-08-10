# Contributing to Hesaplı İzin

Thank you for your interest in contributing to **Hesaplı İzin**! We welcome contributions from developers, designers, and testers of all skill levels.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md) at all times.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs

If you find a bug or unexpected behavior:
1. Search existing [GitHub Issues](https://github.com/your-username/hesapli-izin/issues) to ensure it hasn't already been reported.
2. If not reported, open a new Issue using our **Bug Report** template.
3. Include clear steps to reproduce, browser version, operating system, and screenshots if applicable.

### 2. Suggesting Features

We welcome new feature ideas!
1. Check existing issues to see if your idea is already being discussed.
2. Open a new Issue using our **Feature Request** template.
3. Explain the problem your feature solves and why it would be beneficial for users in Turkey.

### 3. Pull Request (PR) Process

1. **Fork the Repository**: Create your own fork of the project.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-amazing-feature
   ```
3. **Make Your Changes**:
   - Ensure clean TypeScript code with no explicit `any` types where possible.
   - Follow standard Tailwind CSS styling patterns.
   - Maintain strict offline-first client-side execution.
4. **Test Your Changes**:
   Run the TypeScript compiler check and build production bundle locally:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
5. **Commit Your Changes**:
   Use descriptive commit messages following Conventional Commits (e.g. `feat: add custom holiday exporter`, `fix: correct Arefe calculation`).
6. **Submit a Pull Request**:
   - Push your branch to GitHub and open a PR targeting the `main` branch.
   - Fill out our PR template thoroughly.

---

## 🎨 Code Style Guidelines

- **TypeScript**: Use explicit interfaces and types defined in `src/types/holiday.ts`. Avoid unhandled promises or unsafe type assertions.
- **Components**: Keep React components modular, reusable, and single-purpose in `src/components/`.
- **Styling**: Use Tailwind CSS classes. Use `dark:` variants for all colors to maintain Dark/Light mode compatibility.
- **Localization**: User-facing Turkish UI text should be natural and accurate to Turkish corporate/legal terminology. Code documentation and commit messages should be in English.

Thank you for helping make leave planning easier for everyone! 🏖️
