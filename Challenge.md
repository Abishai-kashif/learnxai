Problem:
Students in low-resource settings need personalized, multilingual support aligned to their local curriculum.
Teachers/time/devices are scarce; internet is patchy.
Challenge:
Implement a system where specialized agents coordinate end-to-end:
- Assessment Agent → serves micro-quizzes via the mock API, infers mastery, detects misconceptions.
- Content Curator Agent → retrieves curriculum-aligned passages (from PDFs), selects leveled
practice/material.

- Language Bridge Agent → explains in local language/grade-appropriate reading level; supports code-
switching (Urdu↔English or similar).

- Adaptation Agent → updates the learning path based on signals (accuracy, time-on-task, hints).
- Safety & Policy Agent (lightweight) → enforces curriculum scope, prevents off-topic or unsafe
guidance.
Dataset: Online links related to national and provincial curriculum.
Deliverables:
- Working demo of agentic app.
- Implement agent plan (e.g., a trace or logs: “Assessment Agent → Adaptation Agent → Curator Agent →
Language Bridge → Output”).
- Offline-ready 1-day “learning pack” export (JSON or HTML bundle) that can run without internet.
- Must include a degraded mode for offline, low-bandwidth, or low-cost usage.
Links:-
https://pctb.punjab.gov.pk/E-Books
https://dcar.gos.pk/Sindh%20Curriculum.html
https://dcar.gos.pk/National%20Curriculum.html 