# Contributing to Hesaplı İzin

This repository welcomes contributions to optimize annual leave planning in Turkey. Follow these guidelines to ensure code quality, accurate legal holiday calculations, and client-side privacy.

## Code of Conduct

All contributors and maintainers must adhere to the [Code of Conduct](CODE_OF_CONDUCT.md). Violations should be reported privately to `atacanymc@gmail.com`.

## Development Workflow

### 1. Prerequisites

- Node.js 18.x, 20.x, or 22.x
- npm 9.x or higher

### 2. Local Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/AtaCanYmc/hesapli-izin.git
cd hesapli-izin
npm install
npm run dev
```

The development server starts at `http://localhost:3000`.

### 3. Branch Naming

Create a dedicated branch for each feature or bug fix:

- `feature/<short-description>` for new capabilities or algorithms
- `fix/<short-description>` for holiday corrections or rendering fixes
- `docs/<short-description>` for documentation changes
- `chore/<short-description>` for tooling or dependency updates

```bash
git checkout -b feature/ramadan-dates-2030
```

### 4. Code Standards

- TypeScript: Maintain strict typing. Avoid `any` assertions. Define domain models in `src/types/holiday.ts`.
- Offline First: All computations must execute in the browser. Do not introduce remote server calls or telemetry.
- Component Design: Place UI components in `src/components/`. Use Tailwind CSS utility classes with dark mode variants (`dark:`).
- Turkish Holidays: Verify Islamic and national holiday dates against official Gazete sources before modifying `src/data/holidays.json` or `src/lib/turkeyHolidays.ts`.

### 5. Local Verification

Verify TypeScript compilation and static PWA build before opening a pull request:

```bash
npx tsc --noEmit
npm run build
```

Both commands must exit with code 0.

### 6. Commit Message Convention

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<optional scope>): <description>
```

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | New feature or engine algorithm | `feat(engine): add 2-day Friday penalty rule` |
| `fix` | Bug fix or date correction | `fix(holidays): correct 2028 Kurban Bayram dates` |
| `docs` | Documentation update | `docs(readme): add architecture flowchart` |
| `refactor` | Code restructuring without behavior changes | `refactor(cart): simplify leave date deduplication` |
| `test` | Adding or updating tests | `test(engine): add block leave regression checks` |
| `chore` | Build, CI, or dependency updates | `chore(deps): update date-fns to 3.6.0` |

### 7. Pull Request Submission

1. Push your branch to GitHub.
2. Open a Pull Request targeting the `main` branch.
3. Complete the pull request template with verification commands and technical changes.
4. Ensure all automated CI checks pass.
