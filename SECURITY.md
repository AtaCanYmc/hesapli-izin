# Security Policy

## Supported Versions

Only the latest release on the primary branch receives security and calculation fixes.

| Version | Supported |
| :--- | :---: |
| 1.0.x | Yes |
| < 1.0.0 | No |

## Reporting a Vulnerability

Security issues and data handling concerns should be reported privately to prevent exposure before a patch is published.

1. Send an email to `atacanymc@gmail.com` with the subject line `[SECURITY] hesapli-izin vulnerability report`.
2. Alternatively, submit a private advisory through GitHub at [Security Advisories](https://github.com/AtaCanYmc/hesapli-izin/security/advisories/new).
3. Include the following technical details:
   - Defect type (e.g. calculation exploit, client-side injection, PWA cache poisoning).
   - Step-by-step reproduction instructions or code snippet.
   - Target environment (browser, runtime version, operating system).

## Response SLA

Maintainers acknowledge security reports within 48 hours. A remediation assessment and release timeline will be communicated within 7 business days.

## Privacy & Client-Side Execution Guarantee

Hesaplı İzin operates strictly as an offline-first client-side application.
- All leave optimizations, budget computations, and calendar configurations run in browser memory.
- No network requests transmit annual leave dates, employer details, or user preferences to any remote host.
- State persistence relies solely on browser `localStorage`.
- No third-party tracking scripts, telemetry agents, or advertising pixels exist in the codebase.
