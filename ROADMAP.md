# Product Roadmap

This document outlines planned improvements and architectural milestones for Hesaplı İzin. Priorities reflect legal compliance in Turkey, calculation precision, and offline-first usability.

## Version Milestones

### v1.0.0 (Current Stable Release)

- [x] Official Turkish holiday calendar engine covering 2026 through 2050 with astronomical Hijri shifts.
- [x] Three discrete optimization strategies: Maximum ROI, Long Block Vacations, and Arefe Half-Day Focus.
- [x] Sequential leave planner with locked calendar dates and real-time budget replenishment.
- [x] Dynamic block leave requirement enforcement under Turkish Labor Law Art. 56.
- [x] Corporate Friday 2-day deduction penalty simulation.
- [x] Multi-format export pipeline: iCalendar (`.ics`), HR leave petition PDF, UTF-8 BOM CSV, and Web Share.
- [x] Client-side Progressive Web App (PWA) with Workbox offline service worker caching.
- [x] Dual light and dark theme using Notion and Vercel minimalist design tokens.

### v1.1.0 (Calendar & Import Enhancements)

- [ ] Custom corporate `.ics` file importer to bulk-load employer bridge days and company holidays.
- [ ] Alternative work week schedule configuration (Monday through Saturday 6-day work weeks).
- [ ] Half-day personal leave allocation support in the custom date picker.

### v1.2.0 (Sharing & Multi-Year Projections)

- [ ] Compressed URL state serialization (Base64 LZ-string) to share custom annual plans without server storage.
- [ ] Multi-year leave rollover balance simulator for carrying unused days across calendar years.
- [ ] Export schedule to Markdown table for direct inclusion in personal notes or Notion pages.

### v1.3.0 (Team Coordination)

- [ ] Dual-schedule collision visualizer to compare leave dates with colleagues in-browser.
- [ ] Printable yearly overview poster format for team bulletin boards.
