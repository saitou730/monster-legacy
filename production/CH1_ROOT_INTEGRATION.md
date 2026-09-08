# v1.0 Chapter 1 root integration

Owner: Work. Branch: work/ch1-root-integration. Status: in_progress; claim before source changes.

Base main: 3365c837a5770ac64bbb9f266eb4c868931d6b8e. Chat source: PR42 head86fe407b1370fc9656f888b77e0ed6dbd68369ec.

Planned files: src/chapter1/*, data/chapter1/*, src/storage.js, src/progression.js, src/app.js, index.html, styles/app.css, tests/chapter1-root*, qa/CHAPTER1_ROOT.md, production/next_queue.yaml.

Conflict review: PR42 only touches prototype/chapter1 files; Work consumes a pinned copy in root, does not edit Chat source or prototype HTML. PR32 is merged and its help/intro behavior is preserved. Shared root files are Work-owned per Issue38. No art changes; assets/art and assets/battle remain intact. Public staging stays root-only.

Product: local-only, no multiplayer/network matchmaking/ranking backend. Chat owns design and progression specifications; Work owns integration, battle/mobile UX, QA, merge and deployment.

Release order: v1.0 full Chapter1 and replay-safe local saves first; v1.1 data-driven WORLD/AREA; v1.2 MASTERY/LINEAGE trials; v1.3 NPC-only OFFLINE ARENA; v1.4 data-driven ANOMALY ZONE; v1.5 SANCTUARY. No expansion before v1.0 gate.

v1.0 gate: intro, first battle, boar encounter/retreat, HOME, HUNT/JOIN, PARTY, fixed FUSION, new-species TEST, Lyra SUMMON/support outside party, boar rematch, unyielding LEGACY, ARCHIVE/HOME. Preserve 3/2/1 and NEXT lock, old saves, no duplicate rewards. Browser360/390/430; Android manual separate.
